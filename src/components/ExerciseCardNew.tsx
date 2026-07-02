import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Play, Timer, Minus, Plus, TrendingUp } from 'lucide-react';
import { Exercise, ExerciseSet } from '../types/workout';
import { getPhase } from '../data/programConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { spring } from '../design/motion';
import { haptic } from '../lib/haptics';
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
  const isCalisthenics = exercise.type === 'calisthenics';

  const build = (): ExerciseSet[] => {
    const count = savedSets?.length ? savedSets.length : exercise.sets;
    return Array.from({ length: count }, (_, i) => {
      const s = savedSets?.[i];
      return {
        setNumber: i + 1,
        reps: s?.reps ?? 0,
        weight: s?.weight ?? 0,
        rpe: s?.rpe ?? 8,
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

  const updateSet = (i: number, field: 'reps' | 'weight', value: number) => {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
    setIsSaved(false);
  };

  const bump = (i: number, field: 'reps' | 'weight', delta: number, step = 1) => {
    haptic.light();
    setSets((prev) =>
      prev.map((s, idx) => {
        if (idx !== i) return s;
        const next = Math.max(0, (field === 'reps' ? s.reps : s.weight) + delta * step);
        return { ...s, [field]: field === 'reps' ? Math.round(next) : Math.round(next * 2) / 2 };
      })
    );
    setIsSaved(false);
  };

  const toggleComplete = (i: number) => {
    haptic.light();
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, completed: !s.completed } : s)));
    setIsSaved(false);
  };

  const handleSave = async () => {
    // 0 is a valid value. Saving logs every set in the exercise.
    const payload = sets.map((s) => ({
      ...s,
      rpe: 8,
      completed: true,
    }));

    setIsSaving(true);
    setIsSaved(false);
    try {
      await onSave(payload);
      setSets(payload);
      setIsSaved(true);
      haptic.success();
    } catch (e: any) {
      alert(e.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const completedCount = sets.filter((s) => s.completed).length;

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-hair bg-surface-1 shadow-soft sm:rounded-3xl"
    >
      {/* Hero strip */}
      <div className="relative h-28 overflow-hidden sm:h-32">
        {exercise.imageUrl ? (
          <img src={exercise.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full bg-gradient-to-br from-surface-3 to-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand/20 to-transparent opacity-60" />

        {exercise.videoUrl && (
          <motion.a
            whileTap={{ scale: 0.92 }}
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-grad-red text-white shadow-red"
          >
            <Play className="h-4 w-4 fill-current" />
          </motion.a>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="inline-flex rounded-md bg-brand/90 px-2 py-0.5 font-display text-[10px] font-black italic uppercase text-white">
                {t('log.set')} {index + 1}
              </span>
              <h3 className="mt-1 line-clamp-2 font-display text-lg font-black italic uppercase leading-tight text-txt-hi sm:text-xl">
                {exercise.name}
              </h3>
            </div>
            <div className="shrink-0 rounded-xl border border-hair bg-surface-2/90 px-2.5 py-1.5 text-center backdrop-blur-sm">
              <div className="stat text-lg font-bold leading-none text-brand">{completedCount}</div>
              <div className="text-[8px] font-bold uppercase tracking-wider text-txt-lo">/{sets.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {/* Target + rest chips */}
        <div className="flex flex-wrap gap-2">
          {(targetWeight && !isCalisthenics) && (
            <Chip icon={<TrendingUp className="h-3.5 w-3.5" />} label={t('log.target')} value={`${targetWeight} kg`} tone="brand" />
          )}
          {repRange && (
            <Chip label={t('log.reps')} value={`${repRange[0]} ${t('log.to')} ${repRange[1]}`} tone="coral" />
          )}
          {exercise.rest && (
            <Chip icon={<Timer className="h-3.5 w-3.5" />} label={t('log.rest')} value={exercise.rest} tone="emerald" />
          )}
        </div>

        {/* Sets */}
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {sets.map((set, i) => {
              const prev = prevSets?.find((p) => p.setNumber === set.setNumber);
              const isLast = i === sets.length - 1;
              return (
                <motion.div
                  key={set.setNumber}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring.smooth}
                  className={cn(
                    'relative overflow-hidden rounded-2xl border p-3 transition-colors',
                    set.completed
                      ? 'border-emerald/40 bg-emerald/10 shadow-[0_0_24px_rgba(52,211,153,0.12)]'
                      : 'border-hair bg-surface-2'
                  )}
                >
                  {set.completed && (
                    <motion.div
                      layoutId={`glow-${exercise.id}-${set.setNumber}`}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald/5 to-transparent"
                    />
                  )}

                  <div className="relative flex items-center gap-3">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleComplete(i)}
                      className={cn(
                        'grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-sm font-black italic transition-colors',
                        set.completed
                          ? 'bg-emerald text-white shadow-[0_0_16px_rgba(52,211,153,0.4)]'
                          : 'bg-surface-3 text-txt-mid ring-1 ring-hair hover:text-brand'
                      )}
                    >
                      {set.completed ? <Check className="h-5 w-5" strokeWidth={3} /> : set.setNumber}
                    </motion.button>

                    <div className="grid flex-1 grid-cols-2 gap-2">
                      <StepperField
                        label={t('log.reps')}
                        value={set.reps}
                        tone="coral"
                        onChange={(v) => updateSet(i, 'reps', v)}
                        onBump={(d) => bump(i, 'reps', d, 1)}
                      />
                      <StepperField
                        label={isCalisthenics ? `${t('log.weight')} (${t('log.optional')})` : t('log.weight')}
                        value={set.weight}
                        tone="brand"
                        suffix="kg"
                        step={2.5}
                        onChange={(v) => updateSet(i, 'weight', v)}
                        onBump={(d) => bump(i, 'weight', d, 2.5)}
                      />
                    </div>
                  </div>

                  {prev && (
                    <p className="relative mt-2 pl-14 text-[10px] text-txt-lo">
                      {t('log.lastWeek')}:{' '}
                      <span className="stat font-semibold text-coral">
                        {isCalisthenics ? `${prev.reps} ${t('log.reps').toLowerCase()}` : `${prev.reps} × ${prev.weight} kg`}
                      </span>
                    </p>
                  )}

                  {!isLast && exercise.rest && (
                    <div className="relative mt-3 flex items-center justify-center gap-2 border-t border-dashed border-hair pt-2">
                      <Timer className="h-3 w-3 text-emerald" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald">
                        {t('log.restBetween')}: {exercise.rest}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={spring.snappy}
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-3.5 text-sm font-black uppercase tracking-[0.2em] transition-all',
            isSaved
              ? 'bg-emerald text-white shadow-[0_8px_28px_rgba(52,211,153,0.35)]'
              : 'bg-grad-red text-white shadow-red',
            isSaving && 'opacity-80'
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> {t('log.saving')}
            </>
          ) : isSaved ? (
            <>
              <Check className="h-5 w-5" /> {t('log.saved')}
            </>
          ) : savedSets?.length ? (
            t('log.update')
          ) : (
            t('log.save')
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function Chip({
  icon,
  label,
  value,
  tone,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  tone: 'brand' | 'coral' | 'emerald';
}) {
  const styles = {
    brand: 'border-brand/30 bg-brand-soft text-brand',
    coral: 'border-coral/30 bg-coral/10 text-coral',
    emerald: 'border-emerald/30 bg-emerald/10 text-emerald',
  };
  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5', styles[tone])}>
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{label}</span>
      <span className="stat text-xs font-bold text-txt-hi">{value}</span>
    </div>
  );
}

function StepperField({
  label,
  value,
  tone,
  suffix,
  step = 1,
  onChange,
  onBump,
}: {
  label: string;
  value: number;
  tone: 'brand' | 'coral';
  suffix?: string;
  step?: number;
  onChange: (v: number) => void;
  onBump: (delta: number) => void;
}) {
  const ring = tone === 'brand' ? 'focus-within:ring-brand/50 focus-within:border-brand/60' : 'focus-within:ring-coral/50 focus-within:border-coral/60';
  const labelColor = tone === 'brand' ? 'text-brand' : 'text-coral';

  return (
    <div className={cn('rounded-xl bg-surface-3/80 p-2 ring-1 ring-hair transition-shadow focus-within:ring-2', ring)}>
      <div className={cn('mb-1 text-[9px] font-black uppercase tracking-wider', labelColor)}>{label}</div>
      <div className="flex items-center gap-1">
        <StepBtn onClick={() => onBump(-1)} aria-label={`decrease ${label}`}>
          <Minus className="h-3.5 w-3.5" />
        </StepBtn>
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
            if (!Number.isNaN(parsed)) onChange(parsed);
          }}
          className="stat h-10 min-w-0 flex-1 bg-transparent text-center text-xl font-bold text-txt-hi outline-none placeholder:text-txt-lo [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <StepBtn onClick={() => onBump(1)} aria-label={`increase ${label}`}>
          <Plus className="h-3.5 w-3.5" />
        </StepBtn>
        {suffix && <span className="pr-1 text-[10px] font-bold text-txt-lo">{suffix}</span>}
      </div>
    </div>
  );
}

function StepBtn({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      transition={spring.snappy}
      onClick={onClick}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-txt-mid ring-1 ring-hair hover:text-txt-hi"
      {...props}
    >
      {children}
    </motion.button>
  );
}
