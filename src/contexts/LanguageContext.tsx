import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getLanguagePreference, updateProfileDoc } from '../services/profileService';
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

function readStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('language_preference');
  return isLanguage(saved) ? saved : null;
}

function applyDocumentLanguage(lang: Language) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

function getInitialLanguage(): Language {
  const stored = readStoredLanguage();
  if (stored) {
    applyDocumentLanguage(stored);
    return stored;
  }
  const initial: Language = 'en';
  if (typeof window !== 'undefined') {
    localStorage.setItem('language_preference', initial);
  }
  applyDocumentLanguage(initial);
  return initial;
}

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
    if (!readStoredLanguage() && isLanguage(profileLang)) {
      localStorage.setItem('language_preference', profileLang);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUserId(fbUser.uid);
        try {
          const pref = await getLanguagePreference(fbUser.uid);
          applyProfileLanguage(pref);
        } catch (err) {
          console.warn('Could not load language preference from Firebase:', err);
        }
      } else {
        setUserId(null);
        const stored = readStoredLanguage();
        if (stored) setLanguageState(stored);
      }
    });
    return () => unsub();
  }, [applyProfileLanguage]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language_preference', lang);

    if (userId) {
      try {
        await updateProfileDoc(userId, { languagePreference: lang });
      } catch (error) {
        console.warn('Could not save language preference to profile:', error);
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
