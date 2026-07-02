import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types/workout';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from database with recreation fallback
    const fetchProfile = async (userId: string, userEmail?: string, metadata?: any) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                setProfile({
                    id: data.id,
                    email: data.email,
                    username: data.username,
                    fullName: data.full_name,
                    createdAt: new Date(data.created_at),
                    currentWeek: data.current_week,
                    programStartDate: new Date(data.program_start_date || data.created_at)
                });
            } else if (error && error.code === 'PGRST116') { // Record not found
                // Profile missing, recreate it (logic from App.tsx)
                console.log('Profile missing in AuthContext, creating new profile...');
                const newProfileData = {
                    id: userId,
                    email: userEmail,
                    full_name: metadata?.full_name || userEmail?.split('@')[0],
                    current_week: 1,
                    created_at: new Date().toISOString()
                };

                const { data: inserted, error: insertError } = await supabase
                    .from('profiles')
                    .insert([newProfileData])
                    .select()
                    .single();

                if (inserted) {
                    setProfile({
                        id: inserted.id,
                        email: inserted.email,
                        username: inserted.username,
                        fullName: inserted.full_name,
                        createdAt: new Date(inserted.created_at),
                        currentWeek: inserted.current_week,
                        programStartDate: new Date(inserted.created_at)
                    });
                } else if (insertError) {
                    console.error('Error creating missing profile in AuthContext:', insertError);
                }
            } else if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // Initialize auth state
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sign up with email and password
    const signUp = async (email: string, password: string, metadata?: any) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata || {}
            }
        });
        return { data, error };
    };

    // Sign in with email and password
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        return { error };
    };



    // Sign out
    const signOut = async () => {
        try {
            console.log('Starting logout process...');

            // Clear local state immediately
            setUser(null);
            setProfile(null);
            setSession(null);

            // Call signOut but don't wait for it (it might hang)
            supabase.auth.signOut().then(({ error }) => {
                if (error) {
                    console.error('Supabase signOut error:', error);
                }
            }).catch(err => {
                console.error('SignOut promise error:', err);
            });

            // Manually clear all Supabase auth tokens from localStorage immediately
            setTimeout(() => {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('sb-') || key.includes('supabase')) {
                        localStorage.removeItem(key);
                        console.log('Removed localStorage key:', key);
                    }
                });

                console.log('Logout complete, reloading page...');

                // Force reload to clear all state
                window.location.href = '/';
            }, 300);

        } catch (error) {
            console.error('Error signing out:', error);
            // Force reload anyway to clear state
            setTimeout(() => {
                window.location.href = '/';
            }, 300);
        }
    };



    // Update user profile
    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: updates.username,
                    current_week: updates.currentWeek,
                    program_start_date: updates.programStartDate,
                })
                .eq('id', user.id);

            if (error) throw error;

            // Refresh profile
            await fetchProfile(user.id);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
