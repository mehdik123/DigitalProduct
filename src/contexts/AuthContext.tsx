import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, isTimeoutError } from '../lib/firebase';
import { ensureProfileDoc, fetchProfileDoc, updateProfileDoc } from '../services/profileService';
import { UserProfile } from '../types/workout';

/** App-facing user shape (compatible with previous Supabase usage). */
export interface AuthUser {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    days_per_week?: number;
  };
}

export interface AuthErrorLike {
  message: string;
  code?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: { user: AuthUser } | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string; days_per_week?: number }
  ) => Promise<{ data: { session: { user: AuthUser } | null; user: AuthUser | null }; error: AuthErrorLike | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthErrorLike | null }>;
  signInWithGoogle: () => Promise<{ error: AuthErrorLike | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_INIT_TIMEOUT_MS = 8000;

function toAuthUser(fb: FirebaseUser, meta?: { full_name?: string; days_per_week?: number }): AuthUser {
  return {
    id: fb.uid,
    email: fb.email,
    user_metadata: {
      full_name: meta?.full_name || fb.displayName || undefined,
      days_per_week: meta?.days_per_week,
    },
  };
}

function mapAuthError(err: unknown): AuthErrorLike {
  const e = err as { code?: string; message?: string };
  const code = e.code ?? '';
  if (code === 'auth/email-already-in-use') {
    return { message: 'User already registered', code };
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return { message: 'Invalid email or password', code };
  }
  if (code === 'auth/weak-password') {
    return { message: 'Password should be at least 6 characters', code };
  }
  if (code === 'auth/too-many-requests') {
    return { message: 'Too many attempts. Try again later.', code };
  }
  return { message: e.message || 'Authentication failed', code };
}

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<{ user: AuthUser } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (
    fbUser: FirebaseUser,
    meta?: { full_name?: string; days_per_week?: number }
  ) => {
    try {
      const ensured = await ensureProfileDoc(fbUser.uid, {
        email: fbUser.email,
        fullName: meta?.full_name || fbUser.displayName || undefined,
        daysPerWeek: meta?.days_per_week,
      });
      setProfile(ensured);
    } catch (error) {
      console.error('Error loading profile:', error);
      const fallback = await fetchProfileDoc(fbUser.uid).catch(() => null);
      if (fallback) setProfile(fallback);
    }
  };

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setLoading(false);
    };

    const bailout = setTimeout(() => {
      console.warn('Auth initialization timed out.');
      finish();
    }, AUTH_INIT_TIMEOUT_MS);

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const mapped = toAuthUser(fbUser);
        setUser(mapped);
        setSession({ user: mapped });
        await loadProfile(fbUser);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
      finish();
    });

    return () => {
      clearTimeout(bailout);
      unsub();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string; days_per_week?: number }
  ) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (metadata?.full_name) {
        await firebaseUpdateProfile(cred.user, { displayName: metadata.full_name });
      }
      await ensureProfileDoc(cred.user.uid, {
        email: cred.user.email,
        fullName: metadata?.full_name,
        daysPerWeek: metadata?.days_per_week,
      });
      const mapped = toAuthUser(cred.user, metadata);
      setUser(mapped);
      setSession({ user: mapped });
      await loadProfile(cred.user, metadata);
      return { data: { session: { user: mapped }, user: mapped }, error: null };
    } catch (err) {
      return { data: { session: null, user: null }, error: mapAuthError(err) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err) {
      return { error: mapAuthError(err) };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { error: null };
    } catch (err) {
      return { error: mapAuthError(err) };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      setSession(null);
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      window.location.href = '/';
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    await updateProfileDoc(user.id, {
      username: updates.username,
      fullName: updates.fullName,
      currentWeek: updates.currentWeek,
      programStartDate: updates.programStartDate,
    });
    const refreshed = await fetchProfileDoc(user.id);
    if (refreshed) setProfile(refreshed);
  };

  const value: AuthContextType = {
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

export { isTimeoutError };
