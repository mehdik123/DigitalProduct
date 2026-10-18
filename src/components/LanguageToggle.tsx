import { useLanguage } from '../contexts/LanguageContext';
import { haptic } from '../lib/haptics';
import { cn } from '../lib/utils';
import { LANGUAGES, Language } from '../i18n/translations';

interface LanguageToggleProps {
  compact?: boolean;
  embedded?: boolean;
}

/** Plain-text language switch: active = bone, inactive = faint. */
export default function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const select = (lang: Language) => {
    if (lang !== language) {
      haptic.light();
      setLanguage(lang);
    }
  };

  return (
    <div
      className={cn('inline-flex items-center gap-3.5', compact && 'gap-3')}
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
              'text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors',
              active ? 'text-txt-hi' : 'text-txt-lo hover:text-txt-mid'
            )}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
