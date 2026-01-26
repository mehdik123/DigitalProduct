import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Language, t as translate } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [language, setLanguageState] = useState<Language>('en');
    const [userId, setUserId] = useState<string | null>(null);

    // Load language preference on mount
    useEffect(() => {
        const loadLanguagePreference = async () => {
            // Check if user is logged in
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUserId(session.user.id);

                try {
                    // Load from Supabase profile safely
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('language_preference')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    if (profileData && profileData.language_preference) {
                        setLanguageState(profileData.language_preference as Language);
                    }
                } catch (err) {
                    console.warn('Could not load language preference from Supabase (column might be missing):', err);
                }
            } else {
                // Load from localStorage for non-authenticated users
                const savedLang = localStorage.getItem('language_preference');
                if (savedLang === 'en' || savedLang === 'ar') {
                    setLanguageState(savedLang);
                }
            }
        };

        loadLanguagePreference();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUserId(session.user.id);

                try {
                    // Load language from new user's profile safely
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('language_preference')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    if (profileData && profileData.language_preference) {
                        setLanguageState(profileData.language_preference as Language);
                    }
                } catch (err) {
                    console.warn('Could not load language preference from Supabase:', err);
                }
            } else {
                setUserId(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);

        if (userId) {
            // Save to Supabase if user is logged in
            await supabase
                .from('profiles')
                .update({ language_preference: lang })
                .eq('id', userId);
        } else {
            // Save to localStorage if not logged in
            localStorage.setItem('language_preference', lang);
        }
    };

    const t = (key: string) => translate(key, language);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
