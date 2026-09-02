import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Language, isLanguage, t as translate } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
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

/** Read the device preference synchronously so the first paint matches localStorage. */
function readStoredLanguage(): Language | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('language_preference');
    return isLanguage(saved) ? saved : null;
}

function applyDocumentLanguage(lang: Language) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Seed localStorage on first visit so a Supabase profile fetch cannot briefly
 * override the default English UI before the device preference is recorded.
 */
function getInitialLanguage(): Language {
    const stored = readStoredLanguage();
    if (stored) {
        applyDocumentLanguage(stored);
        return stored;
    }
    const initial: Language = 'en';
    if (typeof window !== 'undefined') {
        localStorage.setItem('language_preference', initial);
        applyDocumentLanguage(initial);
    }
    return initial;
}

/**
 * Device localStorage wins over the Supabase profile so logging in never
 * flashes a different language while the profile fetch resolves.
 */
function resolveLanguage(profileLang: unknown): Language {
    const stored = readStoredLanguage();
    if (stored) return stored;
    if (isLanguage(profileLang)) return profileLang;
    return 'en';
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        applyDocumentLanguage(language);
    }, [language]);

    const applyProfileLanguage = useCallback((profileLang: unknown) => {
        const next = resolveLanguage(profileLang);
        setLanguageState((current) => (current === next ? current : next));
        // Seed localStorage from profile only when the device has no saved choice yet.
        if (!readStoredLanguage() && isLanguage(profileLang)) {
            localStorage.setItem('language_preference', profileLang);
        }
    }, []);

    useEffect(() => {
        const loadLanguagePreference = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUserId(session.user.id);

                try {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('language_preference')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    applyProfileLanguage(profileData?.language_preference);
                } catch (err) {
                    console.warn('Could not load language preference from Supabase:', err);
                }
            } else {
                const stored = readStoredLanguage();
                if (stored) setLanguageState(stored);
            }
        };

        loadLanguagePreference();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUserId(session.user.id);

                try {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('language_preference')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    applyProfileLanguage(profileData?.language_preference);
                } catch (err) {
                    console.warn('Could not load language preference from Supabase:', err);
                }
            } else {
                setUserId(null);
                const stored = readStoredLanguage();
                if (stored) setLanguageState(stored);
            }
        });

        return () => subscription.unsubscribe();
    }, [applyProfileLanguage]);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language_preference', lang);

        if (userId) {
            const { error } = await supabase
                .from('profiles')
                .update({ language_preference: lang })
                .eq('id', userId);
            if (error) {
                console.warn('Could not save language preference to profile:', error.message);
            }
        }
    };

    const t = (key: string, vars?: Record<string, string | number>) => translate(key, language, vars);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
