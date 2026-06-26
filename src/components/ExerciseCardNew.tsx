import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Play, Info, Target } from 'lucide-react';
import { Exercise, ExerciseSet } from '../types/workout';
import { getPhase } from '../data/programConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { itemVariants } from '../design/motion';
import { cn } from '../lib/utils';

interface ExerciseCardNewProps {
  exercise: Exercise;
  index: number;
  weekNumber: number;
  savedSets?: ExerciseSet[];
  prevSets?: ExerciseSet[];
  onSave: (sets: ExerciseSet[]) => Promise<void>;
}

export default function ExerciseCardNew({
  exercise,
  index,
  weekNumber,
  savedSets,
  prevSets,
  onSave,
}: ExerciseCardNewProps) {
  const { t } = useLanguage();
  const phase = getPhase(weekNumber);
  const defaultRpe = phase.targetRPE ?? 8;

  const build = (): ExerciseSet[] => {
    const count = savedSets && savedSets.length > 0 ? savedSets.length : exercise.sets;
    return Array.from({ length: count }, (_, i) => {
      const s = savedSets?.[i];
      return {
        setNumber: i + 1,
        reps: s?.reps ?? 0,
        weight: s?.weight ?? 0,
        rpe: s?.rpe ?? defaultRpe,
        completed: s?.completed ?? false,
        targetReps: s?.targetReps,
        targetWeight: s?.targetWeight,
      };
    });
  };

  const [sets, setSets] = useState<ExerciseSet[]>(build);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSets(build());
    setIsSaved(Boolean(savedSets?.some((s) => s.completed)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSets, weekNumber]);

  const targetWeight = sets[0]?.targetWeight;
  const repRange = phase.repRange;
  const targetText = [
    targetWeight ? `${targetWeight}kg` : null,
    repRange ? `${repRange[0]}-${repRange[1]} ${t('log.reps').toLowerCase()}` : null,
    phase.rpeText !== '-' ? `RPE ${phase.rpeText}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const updateSet = (i: number, field: 'reps' | 'weight' | 'rpe', value: number) => {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
    setIsSaved(false);
  };

  const toggleComplete = (i: number) => {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, completed: !s.completed } : s)));
    setIsSaved(false);
  };

  const handleSave = async () => {
    const payload = sets.map((s) => ({
      ...s,
      completed: s.completed || s.reps > 0,
    }));
    if (!payload.some((s) => s.reps > 0 || s.weight > 0)) {
      alert(t('log.noData'));
      return;
    }

    setIsSaving(true);
    setIsSaved(false);
    try {
      await onSave(payload);
      setSets(payload);
      setIsSaved(true);
    } catch (e: any) {
      alert(e.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="overflow-hidden rounded-3xl border border-hair bg-surface-2"
    >
      {/* Media header */}
      <div className="relative h-40 w-full overflow-hidden">
        {exercise.imageUrl ? (
          <img src={exercise.imageUrl} alt={exercise.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-surface-3" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-2 via-surface-2/60 to-transparent" />
        {exercise.videoUrl && (
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-brand/90 text-white shadow-lg active:scale-95"
          >
            <Play className="h-5 w-5 fill-current" />
          </a>
        )}
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-txt-mid">
            {exercise.name && `#${index + 1}`}
          </span>
          <h3 className="font-display text-2xl font-black italic uppercase leading-none tracking-tight text-txt-hi">
            {exercise.name}
          </h3>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* Target banner */}
        {targetText && (
          <div className="flex items-center gap-2 rounded-2xl bg-brand-soft px-3 py-2">
            <Target className="h-4 w-4 shrink-0 text-brand" />
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-brand/80">
                {t('log.target')}
              </div>
              <div className="tabular-nums truncate text-sm font-bold text-txt-hi">{targetText}</div>
            </div>
          </div>
        )}

        {/* Notes */}
        {exercise.notes && (
          <div className="flex items-start gap-2 rounded-2xl border border-hair bg-surface-3 p-3 text-xs text-txt-mid">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p className="leading-relaxed">{exercise.notes}</p>
          </div>
        )}

        {/* Column headers */}
        <div className="grid grid-cols-[28px_1fr_1fr_1fr_44px] items-center gap-2 px-1">
          <span />
          <span className="text-center text-[10px] font-semibold uppercase tracking-wider text-txt-lo">{t('log.reps')}</span>
          <span className="text-center text-[10px] font-semibold uppercase tracking-wider text-txt-lo">{t('log.weight')}</span>
          <span className="text-center text-[10px] font-semibold uppercase tracking-wider text-txt-lo">{t('log.rpe')}</span>
          <span />
        </div>

        {/* Sets */}
        <div className="space-y-2">
          {sets.map((set, i) => {
            const prev = prevSets?.find((p) => p.setNumber === set.setNumber);
            return (
              <div key={i} className="space-y-1">
                <div className="grid grid-cols-[28px_1fr_1fr_1fr_44px] items-center gap-2">
                  <div className="grid h-8 w-7 place-items-center rounded-lg border border-hair bg-surface-3 text-xs font-bold text-txt-lo">
                    {set.setNumber}
                  </div>
                  <CompactInput value={set.reps} onChange={(v) => updateSet(i, 'reps', v)} />
                  <CompactInput value={set.weight} onChange={(v) => updateSet(i, 'weight', v)} step={0.5} />
                  <CompactInput value={set.rpe ?? defaultRpe} onChange={(v) => updateSet(i, 'rpe', v)} max={10} />
                  <button
                    type="button"
                    onClick={() => toggleComplete(i)}
                    aria-label="toggle complete"
                    className={cn(
                      'grid h-11 w-11 place-items-center rounded-xl border transition-colors active:scale-90',
                      set.completed
                        ? 'border-success/40 bg-success/15 text-success'
                        : 'border-hair bg-surface-3 text-txt-lo'
                    )}
                  >
                    <Check className="h-5 w-5" strokeWidth={3} />
                  </button>
                </div>
                {prev && (
                  <div className="pl-9 text-[10px] font-medium text-txt-lo">
                    {t('log.lastWeek')}: <span className="tabular-nums text-txt-mid">{prev.reps} × {prev.weight}kg</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black uppercase tracking-widest transition-[filter,background] duration-200',
            isSaved ? 'bg-success text-white' : 'bg-grad-red text-white shadow-red hover:brightness-[1.06]',
            isSaving && 'opacity-80'
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {t('log.saving')}
            </>
          ) : isSaved ? (
            <>
              <Check className="h-5 w-5" /> {t('log.saved')}
            </>
          ) : savedSets && savedSets.length > 0 ? (
            t('log.update')
          ) : (
            t('log.save')
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function CompactInput({
  value,
  onChange,
  step = 1,
  max = 9999,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      value={value || ''}
      placeholder="0"
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '') return onChange(0);
        const parsed = parseFloat(raw);
        if (!Number.isNaN(parsed)) onChange(Math.min(max, parsed));
      }}
      className="tabular-nums h-11 w-full rounded-xl border border-hair bg-surface-3 text-center text-base font-bold text-txt-hi outline-none transition-colors focus:border-brand/60 placeholder:text-txt-lo [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}
