import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Trophy } from 'lucide-react';
import { KEY_LIFTS, KEY_LIFT_LABELS } from '../data/programConfig';
import { workoutSplit } from '../data/workoutData';
import {
  saveExerciseSets,
  getComparison,
  ComparisonRow,
} from '../services/workoutService';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Card, NumberInput, StatTile } from './ui';
import { screenVariants, celebrateVariants } from '../design/motion';

interface RetestScreenProps {
  profileId: string;
  onBack: () => void;
}

const dayIdFor = (exerciseId: string): number => {
  for (const day of workoutSplit) {
    if (day.exercises.some((e) => e.id === exerciseId)) return day.id;
  }
  return 1;
};

export default function RetestScreen({ profileId, onBack }: RetestScreenProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<Record<string, { weight: number; reps: number }>>(
    () => Object.fromEntries(KEY_LIFTS.map((id) => [id, { weight: 0, reps: 3 }]))
  );
  const [saving, setSaving] = useState(false);
  const [comparison, setComparison] = useState<ComparisonRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadComparison = async () => {
    const rows = await getComparison(profileId, KEY_LIFTS);
    setComparison(rows);
    setValues((prev) => {
      const next = { ...prev };
      rows.forEach((r) => {
        if (r.currentWeight > 0) next[r.exerciseId] = { weight: r.currentWeight, reps: r.currentReps || 3 };
      });
      return next;
    });
  };

  useEffect(() => {
    loadComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const update = (id: string, field: 'weight' | 'reps', value: number) => {
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const canSave = KEY_LIFTS.every((id) => values[id].weight > 0);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    for (const id of KEY_LIFTS) {
      const v = values[id];
      const res = await saveExerciseSets({
        weekNumber: 12,
        workoutDayId: dayIdFor(id),
        exerciseId: id,
        sets: [
          {
            setNumber: 1,
            reps: v.reps,
            weight: v.weight,
            rpe: 9,
            completed: true,
          },
        ],
      });
      if (!res.success) {
        setError(res.error ?? 'Save failed.');
        setSaving(false);
        return;
      }
    }
    await loadComparison();
    setSaving(false);
  };

  const hasResults = (comparison ?? []).some((r) => r.currentWeight > 0 && r.baselineWeight > 0);

  return (
    <div className="bg-app min-h-screen text-txt-hi">
      <div className="sticky top-0 z-40 border-b border-hair bg-bg/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4">
          <button
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full border border-hair bg-surface-2 active:scale-95 rtl:rotate-180"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-black italic uppercase tracking-tight">{t('retest.title')}</h1>
            <p className="text-xs text-txt-lo">{t('retest.subtitle')}</p>
          </div>
        </div>
      </div>

      <motion.div
        variants={screenVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-2xl space-y-4 px-4 py-6 pb-32"
      >
        {KEY_LIFTS.map((id) => (
          <Card key={id}>
            <h3 className="mb-4 text-lg font-bold text-txt-hi">{KEY_LIFT_LABELS[id] ?? id}</h3>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label={t('log.weight')}
                value={values[id].weight}
                onChange={(v) => update(id, 'weight', v)}
                step={2.5}
                suffix="kg"
              />
              <NumberInput
                label={t('log.reps')}
                value={values[id].reps}
                onChange={(v) => update(id, 'reps', v)}
                step={1}
              />
            </div>
          </Card>
        ))}

        {error && <p className="text-center text-sm text-brand">{error}</p>}

        <Button fullWidth size="lg" disabled={!canSave || saving} onClick={handleSave}>
          {saving ? t('log.saving') : t('retest.save')}
        </Button>

        {hasResults && (
          <motion.div variants={celebrateVariants} initial="hidden" animate="show" className="pt-4">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-brand" />
              <h2 className="font-display text-xl font-black uppercase italic tracking-tight">{t('retest.compare')}</h2>
            </div>
            <div className="space-y-3">
              {comparison!.map((row) => {
                const gained = row.currentWeight - row.baselineWeight;
                return (
                  <Card key={row.exerciseId} accent={gained > 0}>
                    <div className="mb-3 text-sm font-bold text-txt-mid">
                      {KEY_LIFT_LABELS[row.exerciseId] ?? row.exerciseId}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <StatTile label={t('retest.baseline')} value={`${row.baselineWeight}kg`} />
                      <StatTile label={t('retest.now')} value={`${row.currentWeight}kg`} />
                      <StatTile
                        label={t('retest.gained')}
                        tone={gained > 0 ? 'success' : 'default'}
                        value={
                          <span className="inline-flex items-center gap-1">
                            {gained > 0 && <TrendingUp className="h-4 w-4" />}
                            {gained > 0 ? '+' : ''}
                            {gained}kg
                          </span>
                        }
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
