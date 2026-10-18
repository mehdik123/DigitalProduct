import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui';

interface RetestScreenProps {
  profileId: string;
  daysPerWeek?: number;
  onBack?: () => void;
}

/**
 * Cloud retest was removed for local-first 8-week mode.
 * Kept as a tiny stub so old lazy imports do not crash if referenced.
 */
export default function RetestScreen({ onBack }: RetestScreenProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 text-center">
      <h1 className="font-display text-2xl font-black uppercase italic tracking-tight text-txt-hi">
        {t('milestone.complete.title')}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-txt-mid">{t('milestone.complete.body')}</p>
      <Button
        className="mt-8"
        onClick={() => (onBack ? onBack() : navigate('/'))}
      >
        {t('common.back')}
      </Button>
    </div>
  );
}
