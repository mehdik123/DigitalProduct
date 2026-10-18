import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui';
import { haptic } from '../lib/haptics';
import { TOTAL_WEEKS } from '../data/programConfig';

interface WelcomePortalProps {
  onSelectTraining: () => void;
  onSignup: () => void;
  userName?: string;
  weekNumber?: number;
  setsDone?: number;
  setsTotal?: number;
  phaseLabel?: string;
}

function greetingKey(hour: number): string {
  if (hour < 12) return 'home.greet.morning';
  if (hour < 18) return 'home.greet.afternoon';
  return 'home.greet.evening';
}

/**
 * Home — greeting, current week status, one CTA into Train.
 * No “next session” tracking: the Train tab is the source of truth.
 */
export default function WelcomePortal({
  onSelectTraining,
  userName,
  weekNumber = 1,
  setsDone = 0,
  setsTotal = 96,
  phaseLabel,
}: WelcomePortalProps) {
  const { t } = useLanguage();
  const firstName = userName?.split(' ')[0] || t('app.athlete');
  const hour = new Date().getHours();
  const greet = t(greetingKey(hour), { name: firstName });
  const pct = setsTotal > 0 ? Math.round((setsDone / setsTotal) * 100) : 0;

  return (
    <div className="mx-auto min-h-[calc(100dvh-var(--chrome-height))] max-w-lg px-5 pb-nav-space pt-3">
      <p className="text-[15px] font-medium text-txt-mid">{greet}</p>
      <h1 className="mt-2.5 font-display text-[42px] font-semibold uppercase leading-none tracking-tight text-txt-hi">
        {t('home.ready')}
      </h1>

      <div className="mt-5 rounded-[18px] bg-surface-1 p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-lo">
            {t('home.thisWeek')}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-mid">
            {t('home.weekOf', { week: weekNumber, total: TOTAL_WEEKS })}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="flex items-end gap-2.5">
            <span className="font-display text-[72px] font-bold leading-[0.78] tracking-[-0.02em] tabular-nums text-txt-hi">
              {String(weekNumber).padStart(2, '0')}
            </span>
            <span className="pb-1.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-txt-lo">
              {t('workout.week')}
            </span>
          </div>
          {phaseLabel && (
            <p className="max-w-[9rem] pb-1.5 text-right text-[13px] font-medium leading-snug text-txt-mid">
              {phaseLabel}
            </p>
          )}
        </div>

        <div className="prog-track mt-5">
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
            const w = i + 1;
            const filled =
              w < weekNumber ? 1 : w === weekNumber ? Math.min(1, setsTotal > 0 ? setsDone / setsTotal : 0) : 0;
            const isCurrent = w === weekNumber && filled < 1;
            return (
              <i
                key={w}
                style={
                  isCurrent
                    ? { boxShadow: 'inset 0 0 0 1px #E8112D', background: 'transparent' }
                    : undefined
                }
              >
                {(filled > 0 || w < weekNumber) && (
                  <b style={{ width: w < weekNumber ? '100%' : `${Math.max(filled * 100, 4)}%` }} />
                )}
              </i>
            );
          })}
        </div>

        <div className="mt-3 flex justify-between text-[13px] font-medium text-txt-mid">
          <span>{t('home.setsThisWeek', { done: setsDone, total: setsTotal })}</span>
          <span className="tabular-nums text-txt-lo">{pct}%</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-5"
          arrow
          onClick={() => {
            haptic.light();
            onSelectTraining();
          }}
        >
          {t('home.openWorkouts')}
        </Button>
      </div>
    </div>
  );
}
