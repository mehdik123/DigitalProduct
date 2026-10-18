import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Dumbbell, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { WorkoutDay, ExerciseSet } from '../types/workout';
import ExerciseCardNew from './ExerciseCardNew';
import {
  getLocalDaySets,
  getLocalPreviousSets,
  getLocalCompletedCount,
  saveLocalDaySets,
  isLocalDayComplete,
  confirmLocalDayAtTargets,
} from '../services/localProgram';
import { hasLoggedFirstSet, markFirstSetLogged } from '../lib/onboarding';
import {
  evaluateMilestones,
  getMilestoneProgress,
  type MilestoneDef,
} from '../lib/milestones';
import MilestoneModal from './MilestoneModal';
import { getWorkoutSplit, DaysPerWeek } from '../data/workoutData';
import { getPhase, isDeloadWeek, TOTAL_WEEKS } from '../data/programConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { dayName } from '../i18n/content';
import { ProgressRing, Button, StatCounter } from './ui';
import { listVariants } from '../design/motion';
import { celebrateWeekUnlock } from '../lib/celebration';

interface WorkoutPageNewProps {
  workout: WorkoutDay;
  weekNumber: number;
  onBack: () => void;
  profile: { id: string };
  daysPerWeek?: DaysPerWeek | number;
  onWeekUnlocked?: (unlockedWeek: number, isFinal: boolean) => void;
}

export default function WorkoutPageNew({
  workout,
  weekNumber,
  onBack,
  profile,
  daysPerWeek,
  onWeekUnlocked,
}: WorkoutPageNewProps) {
  const { t } = useLanguage();
  const [savedSets, setSavedSets] = useState<Map<string, ExerciseSet[]>>(new Map());
  const [prevSets, setPrevSets] = useState<Map<string, ExerciseSet[]>>(new Map());
  const [done, setDone] = useState(0);
  const [celebration, setCelebration] = useState<{ week: number; final: boolean } | null>(null);
  const [milestoneQueue, setMilestoneQueue] = useState<MilestoneDef[]>([]);
  const [confirmingDay, setConfirmingDay] = useState(false);
  const activeMilestone = milestoneQueue[0] ?? null;

  const phase = getPhase(weekNumber);
  const dayComplete = profile?.id
    ? isLocalDayComplete(profile.id, weekNumber, workout.id)
    : false;

  const expectedTotal = useMemo(() => {
    const deload = isDeloadWeek(weekNumber);
    return getWorkoutSplit(daysPerWeek).reduce(
      (sum, day) =>
        sum +
        day.exercises.reduce(
          (s, e) => s + (deload ? Math.max(1, Math.floor(e.sets / 2)) : e.sets),
          0
        ),
      0
    );
  }, [weekNumber, daysPerWeek]);

  const refreshSavedData = () => {
    if (!profile?.id) return;
    const loaded = new Map<string, ExerciseSet[]>();
    const prev = new Map<string, ExerciseSet[]>();
    for (const exercise of workout.exercises) {
      loaded.set(exercise.id, getLocalDaySets(profile.id, weekNumber, workout.id, exercise.id));
      const p = getLocalPreviousSets(profile.id, weekNumber, workout.id, exercise.id);
      if (p) prev.set(exercise.id, p);
    }
    setSavedSets(loaded);
    setPrevSets(prev);
    setDone(getLocalCompletedCount(profile.id, weekNumber));
  };

  useEffect(() => {
    refreshSavedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, weekNumber, workout.id]);

  const handleSaveExercise = async (exerciseId: string, sets: ExerciseSet[]) => {
    const exercise = workout.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const setsBefore = getLocalCompletedCount(profile.id, weekNumber);
    const dayWasComplete = isLocalDayComplete(profile.id, weekNumber, workout.id);

    const local = saveLocalDaySets(profile.id, weekNumber, workout.id, exercise, sets);
    setSavedSets((prev) => new Map(prev).set(exerciseId, sets));
    setDone(local.completedCount);

    const setsAfter = getLocalCompletedCount(profile.id, weekNumber);
    const dayJustCompleted = !dayWasComplete && isLocalDayComplete(profile.id, weekNumber, workout.id);

    if (!hasLoggedFirstSet() && setsBefore === 0 && setsAfter > 0) {
      markFirstSetLogged();
    }

    const newly = evaluateMilestones({
      userId: profile.id,
      daysPerWeek,
      dayJustCompleted,
      setsLoggedThisWeek: setsAfter,
      unlockedWeek: local.unlockedWeek,
      programFinal: local.final,
    });
    if (newly.length) {
      setMilestoneQueue((q) => [...q, ...newly]);
    } else if (dayJustCompleted) {
      toast.success(t('toast.dayComplete'));
    }

    if (local.unlockedWeek || local.final) {
      setCelebration({ week: local.unlockedWeek ?? weekNumber + 1, final: Boolean(local.final) });
    }
  };

  useEffect(() => {
    if (celebration) celebrateWeekUnlock();
  }, [celebration]);

  const handleConfirmDay = () => {
    if (!profile?.id || confirmingDay || dayComplete) return;
    setConfirmingDay(true);
    try {
      const dayWasComplete = isLocalDayComplete(profile.id, weekNumber, workout.id);
      const setsBefore = getLocalCompletedCount(profile.id, weekNumber);
      const local = confirmLocalDayAtTargets(profile.id, weekNumber, workout.id);
      refreshSavedData();
      setDone(local.completedCount);

      const dayJustCompleted =
        !dayWasComplete && isLocalDayComplete(profile.id, weekNumber, workout.id);

      if (!hasLoggedFirstSet() && setsBefore === 0 && local.completedCount > 0) {
        markFirstSetLogged();
      }

      const newly = evaluateMilestones({
        userId: profile.id,
        daysPerWeek,
        dayJustCompleted,
        setsLoggedThisWeek: local.completedCount,
        unlockedWeek: local.unlockedWeek,
        programFinal: local.final,
      });
      if (newly.length) {
        setMilestoneQueue((q) => [...q, ...newly]);
      } else if (dayJustCompleted) {
        toast.success(t('toast.dayComplete'));
      }

      if (local.unlockedWeek || local.final) {
        setCelebration({ week: local.unlockedWeek ?? weekNumber + 1, final: Boolean(local.final) });
      }
    } finally {
      setConfirmingDay(false);
    }
  };

  const progress = expectedTotal > 0 ? Math.min(1, done / expectedTotal) : 0;

  return (
    <div className="min-h-dvh bg-bg text-txt-hi">
      <div className="sticky top-0 z-40 bg-bg/94 pad-safe-top">
        <div className="mx-auto max-w-lg px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-[36px] font-semibold uppercase leading-none tracking-tight text-txt-hi">
                {dayName(t, workout?.name)}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-txt-mid">
                <span>
                  {t('week.label')} {weekNumber}
                </span>
                <span className="h-[11px] w-px bg-hair-strong" />
                <span className="truncate">{t(phase.phaseLabelKey)}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5 text-[13px] font-semibold text-txt-mid">
              <span className="tabular-nums">
                <StatCounter value={done} />/{expectedTotal}
              </span>
              <ProgressRing
                value={progress}
                size={28}
                strokeWidth={3}
                label={t('progress.ringLabel', { percent: Math.round(progress * 100) })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-3 px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
        {!dayComplete && (
          <div className="rounded-[18px] bg-surface-1 p-4">
            <p className="text-[13px] leading-relaxed text-txt-mid">{t('log.confirmDayHint')}</p>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mt-3.5"
              disabled={confirmingDay}
              onClick={handleConfirmDay}
            >
              {confirmingDay ? t('log.saving') : t('log.confirmDay')}
            </Button>
          </div>
        )}

        {dayComplete && (
          <div className="flex items-center gap-2 rounded-[18px] bg-surface-1 px-4 py-3.5 text-[13px] font-medium text-txt-mid">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
              {t('workout.done')}
            </span>
            <span>{t('log.dayConfirmed')}</span>
          </div>
        )}

        <motion.div className="space-y-3" variants={listVariants} initial="hidden" animate="show">
          {workout.exercises.map((exercise, index) => (
            <ExerciseCardNew
              key={exercise.id}
              exercise={exercise}
              index={index}
              weekNumber={weekNumber}
              savedSets={savedSets.get(exercise.id)}
              prevSets={prevSets.get(exercise.id)}
              onSave={(sets) => handleSaveExercise(exercise.id, sets)}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {celebration && (
          <motion.div
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="absolute inset-0 bg-[rgba(8,8,7,0.72)]" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-lg rounded-t-[28px] bg-surface-1 px-6 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-1px_0_#2E2C29]"
            >
              <div className="mx-auto mb-[22px] h-1 w-[38px] rounded-sm bg-hair-strong" />

              <div className="flex items-end gap-4">
                <span className="font-display text-[clamp(5.5rem,22vw,8rem)] font-bold leading-[0.74] tracking-[-0.03em] tabular-nums text-txt-hi">
                  {celebration.final
                    ? String(TOTAL_WEEKS).padStart(2, '0')
                    : String(celebration.week).padStart(2, '0')}
                </span>
                <div className="pb-1">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-txt-lo">
                    {celebration.final ? t('unlock.finalLabel') : t('unlock.unlocked')}
                  </div>
                  <div className="mt-2 font-display text-[30px] font-semibold uppercase leading-none text-txt-hi">
                    {celebration.final ? t('unlock.finalTitle') : t('workout.week')}
                  </div>
                </div>
              </div>

              <p className="mt-[18px] text-[15px] leading-[22px] text-txt-mid">
                {celebration.final
                  ? t('unlock.finalMessage')
                  : t('unlock.weekReady', { week: celebration.week })}
              </p>

              {!celebration.final && (
                <>
                  <div className="mt-[18px] flex gap-1">
                    {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
                      const w = i + 1;
                      const filled = w < celebration.week;
                      const current = w === celebration.week;
                      return (
                        <i
                          key={w}
                          className="relative h-1.5 flex-1 overflow-hidden rounded-[3px] bg-surface-3"
                          style={
                            current
                              ? { boxShadow: 'inset 0 0 0 1px #E8112D', background: 'transparent' }
                              : undefined
                          }
                        >
                          {filled && <b className="absolute inset-0 bg-brand" />}
                          {current && (
                            <b className="absolute inset-y-0 left-0 w-1/4 rounded-[3px] bg-brand" />
                          )}
                        </i>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-[14px] bg-surface-2 px-4">
                    {[
                      { icon: TrendingUp, text: t('unlock.point1') },
                      { icon: Dumbbell, text: t('unlock.point2') },
                      { icon: Lock, text: t('unlock.point3') },
                    ].map(({ icon: Icon, text }, idx, arr) => (
                      <div
                        key={idx}
                        className={`flex gap-3 py-[13px] text-sm font-medium leading-5 text-txt-hi ${
                          idx < arr.length - 1 ? 'border-b border-hair' : ''
                        }`}
                      >
                        <Icon className="mt-px h-4 w-4 shrink-0 text-txt-mid" strokeWidth={1.75} />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <Button
                fullWidth
                size="lg"
                className="mt-[22px]"
                arrow
                onClick={() => {
                  const c = celebration;
                  setCelebration(null);
                  onWeekUnlocked?.(c.week, c.final);
                  onBack();
                }}
              >
                {t('unlock.continue')}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MilestoneModal
        milestone={activeMilestone}
        progress={
          activeMilestone
            ? getMilestoneProgress(profile.id)
            : undefined
        }
        onClose={() => setMilestoneQueue((q) => q.slice(1))}
      />
    </div>
  );
}
