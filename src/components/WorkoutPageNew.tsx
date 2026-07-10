import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, PartyPopper, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkoutDay, ExerciseSet } from '../types/workout';
import ExerciseCardNew from './ExerciseCardNew';
import { pushProgramToCloud } from '../services/workoutService';
import {
  getLocalDaySets,
  getLocalPreviousSets,
  getLocalCompletedCount,
  getLocalProgramState,
  collectAllSets,
  saveLocalDaySets,
} from '../services/localProgram';
import { getWorkoutSplit, DaysPerWeek } from '../data/workoutData';
import { getPhase, isDeloadWeek } from '../data/programConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { ProgressRing, Button, StatCounter } from './ui';
import { celebrateVariants } from '../design/motion';
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

  const phase = getPhase(weekNumber);

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

    // Local-first: persist instantly so logging always works offline.
    const local = saveLocalDaySets(profile.id, weekNumber, workout.id, exercise, sets);
    setSavedSets((prev) => new Map(prev).set(exerciseId, sets));
    setDone(local.completedCount);

    if (local.unlockedWeek || local.final) {
      setCelebration({ week: local.unlockedWeek ?? weekNumber + 1, final: Boolean(local.final) });
    }

    // Best-effort permanent backup to Supabase — never blocks local logging.
    void backgroundSync();
  };

  const backgroundSync = async () => {
    try {
      const state = getLocalProgramState(profile.id);
      await pushProgramToCloud(profile.id, collectAllSets(profile.id), state.currentWeek, state.weeks);
    } catch (e) {
      console.warn('[WorkoutPage] cloud sync skipped (offline):', e);
    }
  };

  useEffect(() => {
    if (celebration) celebrateWeekUnlock();
  }, [celebration]);

  const progress = expectedTotal > 0 ? Math.min(1, done / expectedTotal) : 0;

  return (
    <div className="bg-app min-h-dvh text-txt-hi">
      <div className="sticky top-0 z-40 border-b border-hair bg-bg/60 backdrop-blur-xl pad-safe-top">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="grid h-10 w-10 place-items-center rounded-full border border-hair bg-surface-2 active:scale-95 rtl:rotate-180"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-lg font-black italic uppercase tracking-tight sm:text-2xl">
                {workout?.name}
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-txt-mid sm:text-xs">
                <span className="shrink-0 text-brand">{t('week.label')} {weekNumber}</span>
                <span className="h-1 w-1 shrink-0 rounded-full bg-txt-lo" />
                <span className="truncate">{t(phase.phaseLabelKey)}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 sm:gap-4">
            <ProgressRing
              value={progress}
              size={64}
              strokeWidth={7}
              label={`Week progress ${Math.round(progress * 100)}%`}
            />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-wider text-txt-lo sm:text-[10px]">
                <span className="truncate">{t('progress.weekLabel')}</span>
                <span className="shrink-0">
                  <StatCounter value={done} /> / <span className="stat">{expectedTotal}</span>
                </span>
              </div>
              <p className="truncate text-[11px] text-txt-mid sm:text-xs">
                {t('progress.setsLogged', { done, total: expectedTotal })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-4 px-3 py-5 pb-nav-space sm:space-y-5 sm:px-4 sm:py-6">
        {workout?.description && (
          <p className="rounded-2xl border border-hair bg-surface-2 p-4 text-sm leading-relaxed text-txt-mid">
            {workout.description}
          </p>
        )}

        <div className="space-y-5">
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
        </div>
      </div>

      <AnimatePresence>
        {celebration && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={celebrateVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full max-w-sm rounded-3xl border border-success/30 bg-surface-2 p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success"
              >
                <PartyPopper className="h-8 w-8" />
              </motion.div>
              <h2 className="font-display text-3xl font-black uppercase italic tracking-tight">
                {celebration.final ? t('unlock.finalTitle') : t('unlock.title')}
              </h2>

              {celebration.final ? (
                <p className="mt-2 text-sm text-txt-mid">{t('unlock.finalMessage')}</p>
              ) : (
                <>
                  <p className="mt-2 text-sm text-txt-mid">
                    {t('unlock.weekReady', { week: celebration.week })}
                  </p>
                  <div className="mt-5 space-y-2 rounded-2xl border border-hair bg-surface-1 p-4 text-left">
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-success">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {t('unlock.whatChanged')}
                    </p>
                    <ul className="space-y-1.5 text-xs leading-relaxed text-txt-mid">
                      <li>• {t('unlock.point1')}</li>
                      <li>• {t('unlock.point2')}</li>
                      <li>• {t('unlock.point3')}</li>
                    </ul>
                  </div>
                </>
              )}

              <div className="mt-6">
                <Button
                  fullWidth
                  onClick={() => {
                    const c = celebration;
                    setCelebration(null);
                    onWeekUnlocked?.(c.week, c.final);
                    onBack();
                  }}
                >
                  {t('unlock.continue')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
