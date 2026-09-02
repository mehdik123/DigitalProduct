import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Play, Timer, Minus, Plus, TrendingUp } from 'lucide-react';
import { Exercise, ExerciseSet } from '../types/workout';
import { useLanguage } from '../contexts/LanguageContext';
import { exerciseName, localizeMinutes } from '../i18n/content';
import { itemVariants, listVariants, spring, tapSubtle } from '../design/motion';
import { haptic } from '../lib/haptics';
import { cn } from '../lib/utils';
import { VideoModal } from './ui/VideoModal';
import { getYouTubeThumbnails } from '../lib/youtube';
import { toast } from 'sonner';

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
  const localizedName = exerciseName(t, exercise.name);
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
  const [showVideo, setShowVideo] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);

  const coverCandidates = useMemo(() => {
    const candidates = getYouTubeThumbnails(exercise.videoUrl);
    if (exercise.imageUrl) candidates.push(exercise.imageUrl);
    return candidates;
  }, [exercise.videoUrl, exercise.imageUrl]);

  const cover = coverCandidates[coverIndex] ?? null;

  useEffect(() => {
    setCoverIndex(0);
  }, [exercise.id]);

  useEffect(() => {
    setSets(build());
    setIsSaved(Boolean(savedSets?.some((s) => s.completed)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSets, weekNumber]);

  const targetWeight = sets[0]?.targetWeight;

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
    const allEmpty = sets.every((s) => s.reps === 0 && s.weight === 0);
    if (allEmpty) {
      toast.error(t('toast.emptySave'));
      return;
    }

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
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const completedCount = sets.filter((s) => s.completed).length;

  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover={{ y: -2 }}
      transition={spring.snappy}
      className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-surface-1/90 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-[border-color,box-shadow] hover:border-brand/30 hover:shadow-[0_8px_28px_rgba(255,45,85,0.12)]"
    >
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            onError={() => setCoverIndex((i) => i + 1)}
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-surface-3 to-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/50 to-transparent" />

        {exercise.videoUrl && (
          <button
            type="button"
            onClick={() => {
              haptic.light();
              setShowVideo(true);
            }}
            aria-label={t('log.playVideo', { name: localizedName })}
            className="absolute inset-0 z-10 cursor-pointer active:bg-black/10"
          />
        )}

        {exercise.videoUrl && (
          <motion.span
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-grad-red text-white shadow-red sm:h-11 sm:w-11"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={spring.snappy}
          >
            <Play className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
          </motion.span>
        )}

        <div className="pointer-events-none absolute bottom-2 left-2 right-2 z-20 sm:bottom-2.5 sm:left-2.5 sm:right-2.5">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-full bg-brand/90 px-1.5 py-px text-[7px] font-black uppercase tracking-wider text-white sm:text-[8px]">
                {t('log.set')} {index + 1}
              </span>
              <h3 className="mt-0.5 line-clamp-1 font-display text-sm font-black uppercase italic leading-tight text-txt-hi sm:text-base">
                {localizedName}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-white/15 bg-surface-2/90 px-2 py-1 backdrop-blur-sm">
              <span className="stat text-xs font-bold leading-none text-brand sm:text-sm">{completedCount}</span>
              <span className="text-[8px] font-bold text-txt-lo">/{sets.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-2 sm:p-2.5">
        {(targetWeight && !isCalisthenics) || exercise.rest ? (
          <div className="flex flex-wrap gap-1">
            {targetWeight && !isCalisthenics && (
              <Chip icon={<TrendingUp className="h-3 w-3" />} label={t('log.target')} value={`${targetWeight} kg`} tone="brand" />
            )}
            {exercise.rest && (
              <Chip icon={<Timer className="h-3 w-3" />} label={t('log.rest')} value={localizeMinutes(t, exercise.rest)} tone="emerald" />
            )}
          </div>
        ) : null}

        {/* Set rows */}
        <motion.div className="space-y-1.5" variants={listVariants} initial="hidden" animate="show">
          <AnimatePresence initial={false}>
            {sets.map((set, i) => {
              const prev = prevSets?.find((p) => p.setNumber === set.setNumber);
              return (
                <motion.div
                  key={set.setNumber}
                  layout
                  variants={itemVariants}
                  whileHover={{ scale: 1.005 }}
                  whileTap={tapSubtle}
                  transition={spring.snappy}
                  className={cn(
                    'relative overflow-hidden rounded-[1.1rem] border px-1.5 py-1.5 transition-colors sm:px-2',
                    set.completed
                      ? 'border-success/35 bg-success/[0.08] shadow-[0_4px_16px_rgba(34,197,94,0.1)]'
                      : 'border-white/10 bg-surface-2/80 hover:border-brand/25'
                  )}
                >
                  {set.completed && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-success/5 to-transparent" />
                  )}

                  <div className="relative flex items-center gap-1.5 sm:gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.9 }}
                      transition={spring.snappy}
                      onClick={() => toggleComplete(i)}
                      className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-xs font-black italic transition-colors sm:h-9 sm:w-9',
                        set.completed
                          ? 'bg-success text-white shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'border border-white/10 bg-surface-3 text-txt-mid hover:border-brand/30 hover:text-brand'
                      )}
                    >
                      {set.completed ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : set.setNumber}
                    </motion.button>

                    <div className="grid min-w-0 flex-1 grid-cols-2 gap-1 sm:gap-1.5">
                      <StepperField
                        label={t('log.reps')}
                        value={set.reps}
                        tone="coral"
                        onChange={(v) => updateSet(i, 'reps', v)}
                        onBump={(d) => bump(i, 'reps', d, 1)}
                      />
                      <StepperField
                        label={t('log.weight')}
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
                    <p className="relative mt-1 pl-9 text-[9px] leading-none text-txt-lo sm:pl-10">
                      {t('log.lastWeek')}:{' '}
                      <span className="stat font-semibold text-coral">
                        {isCalisthenics ? `${prev.reps} ${t('log.reps').toLowerCase()}` : `${prev.reps} × ${prev.weight} kg`}
                      </span>
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={tapSubtle}
          transition={spring.snappy}
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'relative flex h-10 w-full items-center justify-center gap-1.5 overflow-hidden rounded-full text-[10px] font-black uppercase tracking-[0.18em] transition-all sm:h-11 sm:text-[11px]',
            isSaved
              ? 'bg-success text-white shadow-[0_6px_20px_rgba(52,211,153,0.3)]'
              : 'bg-grad-red text-white shadow-red',
            isSaving && 'opacity-80'
          )}
        >
          {!isSaved && !isSaving && (
            <motion.span
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-120%', '120%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t('log.saving')}
              </>
            ) : isSaved ? (
              <>
                <Check className="h-4 w-4" /> {t('log.saved')}
              </>
            ) : savedSets?.length ? (
              t('log.update')
            ) : (
              t('log.save')
            )}
          </span>
        </motion.button>
      </div>

      <VideoModal
        open={showVideo}
        onClose={() => setShowVideo(false)}
        videoUrl={exercise.videoUrl}
        title={localizedName}
      />
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
    brand: 'border-brand/25 bg-brand/10 text-brand',
    coral: 'border-coral/25 bg-coral/10 text-coral',
    emerald: 'border-emerald/25 bg-emerald/10 text-emerald',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5', styles[tone])}>
      {icon}
      <span className="text-[7px] font-bold uppercase tracking-wider opacity-80 sm:text-[8px]">{label}</span>
      <span className="stat text-[10px] font-bold text-txt-hi sm:text-[11px]">{value}</span>
    </span>
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
  const accent = tone === 'brand' ? 'text-brand' : 'text-coral';

  return (
    <div className="rounded-[0.9rem] border border-white/8 bg-surface-3/60 px-1 py-1 transition-colors focus-within:border-white/20 sm:rounded-xl">
      <div className={cn('mb-0.5 truncate text-center text-[7px] font-black uppercase tracking-wider sm:text-[8px]', accent)}>
        {label}
      </div>
      <div className="flex items-center gap-0.5">
        <StepBtn tone={tone} onClick={() => onBump(-1)} aria-label={`decrease ${label}`}>
          <Minus className="h-3 w-3" strokeWidth={3} />
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
          className="stat h-7 min-w-0 flex-1 bg-transparent text-center text-sm font-bold text-txt-hi outline-none placeholder:text-txt-lo [appearance:textfield] sm:h-8 sm:text-base [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <StepBtn tone={tone} onClick={() => onBump(1)} aria-label={`increase ${label}`}>
          <Plus className="h-3 w-3" strokeWidth={3} />
        </StepBtn>
        {suffix && <span className="w-5 shrink-0 text-center text-[8px] font-bold text-txt-lo">{suffix}</span>}
      </div>
    </div>
  );
}

function StepBtn({
  children,
  tone,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone: 'brand' | 'coral' }) {
  const hover =
    tone === 'brand'
      ? 'hover:border-brand/40 hover:bg-brand/15 hover:text-brand'
      : 'hover:border-coral/40 hover:bg-coral/15 hover:text-coral';

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      transition={spring.snappy}
      onClick={(e) => {
        haptic.light();
        onClick?.(e);
      }}
      className={cn(
        'grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 bg-surface-2/80 text-txt-mid transition-colors sm:h-7 sm:w-7',
        hover
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
