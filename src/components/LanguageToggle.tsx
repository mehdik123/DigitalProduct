import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { haptic } from '../lib/haptics';
import { spring } from '../design/motion';
import { cn } from '../lib/utils';
import { LANGUAGES, Language } from '../i18n/translations';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const select = (lang: Language) => {
    if (lang !== language) {
      haptic.light();
      setLanguage(lang);
    }
  };

  return (
    <div
      className="relative inline-flex rounded-xl border border-hair bg-surface-2 p-0.5 shadow-soft"
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((lang) => {
        const active = language === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => select(lang)}
            aria-pressed={active}
            className={cn(
              'relative z-10 min-h-[36px] min-w-[38px] rounded-[10px] px-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-colors sm:min-w-[44px] sm:px-3 sm:tracking-[0.2em]',
              active ? 'text-white' : 'text-txt-lo hover:text-txt-hi'
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-[10px] bg-grad-red shadow-red"
                transition={spring.snappy}
              />
            )}
            <span className="relative z-10">{lang.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
