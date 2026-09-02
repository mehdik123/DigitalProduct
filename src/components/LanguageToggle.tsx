import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { haptic } from '../lib/haptics';
import { spring, tapSubtle } from '../design/motion';
import { cn } from '../lib/utils';
import { LANGUAGES, Language } from '../i18n/translations';

interface LanguageToggleProps {
  /** Tighter sizing for the fixed AppChrome header on mobile. */
  compact?: boolean;
  /** Render inside the unified chrome actions pill (no outer border). */
  embedded?: boolean;
}

export default function LanguageToggle({ compact = false, embedded = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const select = (lang: Language) => {
    if (lang !== language) {
      haptic.light();
      setLanguage(lang);
    }
  };

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center',
        embedded
          ? 'gap-px'
          : cn(
              'rounded-full border border-white/10 bg-surface-1/70 p-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md',
              compact ? 'max-w-[calc(100vw-8rem)]' : 'p-1'
            )
      )}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((lang) => {
        const active = language === lang;
        return (
          <motion.button
            key={lang}
            type="button"
            onClick={() => select(lang)}
            aria-pressed={active}
            whileTap={tapSubtle}
            transition={spring.snappy}
            className={cn(
              'relative z-10 font-black uppercase transition-colors',
              compact
                ? 'min-h-[28px] min-w-[26px] rounded-full px-1.5 text-[8px] tracking-[0.06em] sm:min-h-[32px] sm:min-w-[32px] sm:px-2 sm:text-[9px]'
                : 'min-h-[34px] min-w-[36px] rounded-full px-2.5 text-[10px] tracking-[0.12em] sm:min-w-[42px] sm:text-[11px]',
              active ? 'text-white' : 'text-txt-lo hover:bg-white/5 hover:text-txt-hi'
            )}
          >
            {active && (
              <motion.span
                layoutId={embedded ? 'lang-pill-chrome' : 'lang-pill'}
                className="absolute inset-0 rounded-full bg-grad-red shadow-red"
                transition={spring.snappy}
              />
            )}
            <span className="relative z-10">{lang.toUpperCase()}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
