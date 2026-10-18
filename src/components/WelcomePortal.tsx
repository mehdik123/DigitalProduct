import { Clock, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui';
import { haptic } from '../lib/haptics';
import { dayName } from '../i18n/content';
import type { WorkoutDay } from '../types/workout';
import { TOTAL_WEEKS } from '../data/programConfig';

interface WelcomePortalProps {
  onSelectTraining: () => void;
  onStartWorkout?: () => void;
  onSignup: () => void;
  userName?: string;
  weekNumber?: number;
  dayNumber?: number;
  nextWorkout?: WorkoutDay | null;
  setsDone?: number;
  setsTotal?: number;
  phaseLabel?: string;
}

function greetingKey(hour: number): string {
  if (hour < 12) return 'home.greet.morning';
  if (hour < 18) return 'home.greet.afternoon';
  return 'home.greet.evening';
}

/** P03 — Home: greeting, up-next card, 8-week program track. */
export default function WelcomePortal({
  onSelectTraining,
  onStartWorkout,
  userName,
  weekNumber = 1,
  dayNumber = 1,
  nextWorkout,
  setsDone = 0,
  setsTotal = 96,
  phaseLabel,
}: WelcomePortalProps) {
  const { t } = useLanguage();
  const firstName = userName?.split(' ')[0] || t('app.athlete');
  const hour = new Date().getHours();
  const greet = t(greetingKey(hour), { name: firstName });

  const preview = nextWorkout?.exercises.slice(0, 2) ?? [];
  const more = Math.max(0, (nextWorkout?.exercises.length ?? 0) - preview.length);
  const weekFrac = Math.min(1, Math.max(0, weekNumber - 1 + (setsTotal > 0 ? setsDone / setsTotal : 0)));

  return (
    <div className="mx-auto min-h-[calc(100dvh-var(--chrome-height))] max-w-lg px-5 pb-nav-space pt-3">
      <p className="text-[15px] font-medium text-txt-mid">{greet}</p>
      <h1 className="mt-2.5 font-display text-[42px] font-semibold uppercase leading-none tracking-tight text-txt-hi">
        {t('home.ready')}
      </h1>

      {nextWorkout ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-5 rounded-[18px] bg-surface-1 p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              {t('home.upNext')}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-lo">
              {t('workout.week')} {weekNumber}
              <span className="mx-2.5 inline-block h-[11px] w-px bg-hair-strong align-middle" />
              {t('home.day')} {dayNumber}
            </span>
          </div>

          <h2 className="mt-3 font-display text-[36px] font-semibold uppercase leading-none text-txt-hi">
            {dayName(t, nextWorkout.name)}
          </h2>

          <div className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-txt-mid">
            <Clock className="h-3.5 w-3.5 text-txt-lo" strokeWidth={2} />
            <span>{nextWorkout.duration}</span>
            <span className="mx-2 h-[11px] w-px bg-hair-strong" />
            <List className="h-3.5 w-3.5 text-txt-lo" strokeWidth={2} />
            <span>
              {nextWorkout.exercises.length} {t('home.exercises')}
            </span>
          </div>

          <div className="mt-4 border-t border-hair">
            {preview.map((ex, i) => (
              <div
                key={ex.id}
                className="flex h-10 items-center justify-between border-b border-hair text-sm font-medium"
              >
                <span>
                  <em className="mr-3 font-display text-[15px] font-semibold not-italic text-txt-lo">
                    {String(i + 1).padStart(2, '0')}
                  </em>
                  {ex.name}
                </span>
                <span className="text-[13px] text-txt-lo">
                  {ex.sets} {t('home.sets')}
                </span>
              </div>
            ))}
            {more > 0 && (
              <div className="flex h-10 items-center text-sm font-medium text-txt-mid">
                <em className="mr-3 w-[1.65rem] font-display text-[15px] font-semibold not-italic text-txt-lo opacity-0">
                  00
                </em>
                + {more} {t('home.more')}
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="mt-[18px]"
            arrow
            onClick={() => {
              haptic.light();
              (onStartWorkout ?? onSelectTraining)();
            }}
          >
            {t('home.startWorkout')}
          </Button>
        </motion.div>
      ) : (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-8"
          arrow
          onClick={() => {
            haptic.light();
            onSelectTraining();
          }}
        >
          {t('welcome.startWorkout')}
        </Button>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-lo">
            {t('home.program')}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-txt-mid">
            {t('home.weekOf', { week: weekNumber, total: TOTAL_WEEKS })}
          </span>
        </div>

        <div className="prog-track mt-3.5">
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
          <span className="text-txt-lo">{phaseLabel}</span>
        </div>
      </div>

      {/* keep weekFrac referenced for potential future use without unused lint */}
      <span className="sr-only">{Math.round(weekFrac * 100)}%</span>
    </div>
  );
}
