import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import { KEY_LIFTS, KEY_LIFT_LABELS } from '../data/programConfig';
import { submitBaseline, BaselineLift } from '../services/workoutService';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Card, NumberInput } from './ui';
import { screenVariants, listVariants, itemVariants } from '../design/motion';

interface BaselineScreenProps {
  onComplete: () => void;
}

export default function BaselineScreen({ onComplete }: BaselineScreenProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<Record<string, { weight: number; reps: number }>>(
    () => Object.fromEntries(KEY_LIFTS.map((id) => [id, { weight: 0, reps: 5 }]))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (id: string, field: 'weight' | 'reps', value: number) => {
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const canSubmit = KEY_LIFTS.every((id) => values[id].weight > 0);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    const lifts: BaselineLift[] = KEY_LIFTS.map((id) => ({
      exerciseId: id,
      weight: values[id].weight,
      reps: values[id].reps,
    }));
    const res = await submitBaseline(lifts);
    setSaving(false);
    if (res.success) onComplete();
    else setError(res.error ?? 'Could not save baseline.');
  };

  return (
    <motion.div
      variants={screenVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto px-4 py-8 pb-32"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Dumbbell className="h-7 w-7" />
        </div>
        <h1 className="font-display text-4xl font-black italic uppercase tracking-tight text-txt-hi">
          {t('baseline.title')}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-txt-mid">{t('baseline.subtitle')}</p>
      </div>

      <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-4">
        {KEY_LIFTS.map((id) => (
          <motion.div key={id} variants={itemVariants}>
            <Card>
              <h3 className="mb-4 text-lg font-bold text-txt-hi">{KEY_LIFT_LABELS[id] ?? id}</h3>
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label={t('baseline.weight')}
                  value={values[id].weight}
                  onChange={(v) => update(id, 'weight', v)}
                  step={2.5}
                  suffix="kg"
                />
                <NumberInput
                  label={t('baseline.reps')}
                  value={values[id].reps}
                  onChange={(v) => update(id, 'reps', v)}
                  step={1}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {error && <p className="mt-4 text-center text-sm text-brand">{error}</p>}

      <div className="mt-8">
        <Button fullWidth size="lg" disabled={!canSubmit || saving} onClick={handleSubmit}>
          {saving ? t('baseline.saving') : t('baseline.submit')}
        </Button>
      </div>
    </motion.div>
  );
}
