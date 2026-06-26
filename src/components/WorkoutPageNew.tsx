import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkoutDay, ExerciseSet } from '../types/workout';
import ExerciseCardNew from './ExerciseCardNew';
import {
  saveExerciseSets,
  loadWorkoutSets,
  getCompletedSetCount,
  completeWeek,
} from '../services/workoutService';
import { workoutSplit } from '../data/workoutData';
import { getPhase, isDeloadWeek } from '../data/programConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { ProgressBar, Skeleton, Button } from './ui';
import { listVariants, celebrateVariants } from '../design/motion';

interface WorkoutPageNewProps {
  workout: WorkoutDay;
  weekNumber: number;
  onBack: () => void;
  profile: { id: string };
  onWeekUnlocked?: (unlockedWeek: number, isFinal: boolean) => void;
}

export default function WorkoutPageNew({
  workout,
  weekNumber,
  onBack,
  profile,
  onWeekUnlocked,
}: WorkoutPageNewProps) {
  const { t } = useLanguage();
  const [savedSets, setSavedSets] = useState<Map<string, ExerciseSet[]>>(new Map());
  const [prevSets, setPrevSets] = useState<Map<string, ExerciseSet[]>>(new Map());
  const [done, setDone] = useState(0);
  const [loading, setLoading] = useState(true);
  const [celebration, setCelebration] = useState<{ week: number; final: boolean } | null>(null);

  const phase = getPhase(weekNumber);

  const expectedTotal = useMemo(() => {
    const deload = isDeloadWeek(weekNumber);
    return workoutSplit.reduce(
      (sum, day) =>
        sum +
        day.exercises.reduce(
          (s, e) => s + (deload ? Math.max(1, Math.floor(e.sets / 2)) : e.sets),
          0
        ),
      0
    );
  }, [weekNumber]);

  useEffect(() => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setLoading(true);
      const [loaded, prev, count] = await Promise.all([
        loadWorkoutSets(profile.id, weekNumber, workout.id),
        weekNumber > 1 ? loadWorkoutSets(profile.id, weekNumber - 1, workout.id) : Promise.resolve(new Map()),
        getCompletedSetCount(profile.id, weekNumber).catch(() => 0),
      ]);
      if (cancelled) return;
      setSavedSets(loaded);
      setPrevSets(prev as Map<string, ExerciseSet[]>);
      setDone(count);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [profile?.id, weekNumber, workout.id]);

  const handleSaveExercise = async (exerciseId: string, sets: ExerciseSet[]) => {
    const result = await saveExerciseSets({
      weekNumber,
      workoutDayId: workout.id,
      exerciseId,
      sets,
    });

    if (!result.success) {
      throw new Error(result.error || 'Save failed');
    }

    setSavedSets((prev) => new Map(prev).set(exerciseId, sets));

    // Refresh week-level progress and attempt to complete the week.
    const count = await getCompletedSetCount(profile.id, weekNumber).catch(() => done);
    setDone(count);

    if (count >= expectedTotal) {
      const res = await completeWeek(weekNumber);
      // Only celebrate on a genuine unlock (not on re-saves of an already-completed week).
      if (res.success && (res.unlockedWeek || res.final)) {
        setCelebration({ week: res.unlockedWeek ?? weekNumber + 1, final: Boolean(res.final) });
      }
    }
  };

  const progress = expectedTotal > 0 ? Math.min(1, done / expectedTotal) : 0;

  return (
    <div className="bg-app min-h-screen text-txt-hi">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-hair bg-bg/60 backdrop-blur-xl">
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
              <h1 className="truncate font-display text-2xl font-black italic uppercase tracking-tight">
                {workout?.name}
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-txt-mid">
                <span className="text-brand">{t('week.label')} {weekNumber}</span>
                <span className="h-1 w-1 rounded-full bg-txt-lo" />
                <span>{t(phase.phaseLabelKey)}</span>
              </div>
            </div>
          </div>

          {/* Week progress */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-txt-lo">
              <span>{t('progress.weekLabel')}</span>
              <span className="tabular-nums">{t('progress.setsLogged', { done, total: expectedTotal })}</span>
            </div>
            <ProgressBar value={progress} tone={progress >= 1 ? 'success' : 'brand'} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-32">
        {workout?.description && (
          <p className="rounded-2xl border border-hair bg-surface-2 p-4 text-sm leading-relaxed text-txt-mid">
            {workout.description}
          </p>
        )}

        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-3xl" />
            ))}
          </div>
        ) : (
          <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-5">
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
        )}
      </div>

      {/* Unlock celebration */}
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
              <p className="mt-2 text-sm text-txt-mid">{t('unlock.message')}</p>
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

