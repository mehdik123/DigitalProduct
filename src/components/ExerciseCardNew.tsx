import { useState, useEffect, useMemo } from 'react';
import { Check, Loader2, Play, Timer, Minus, Plus } from 'lucide-react';
import { Exercise, ExerciseSet } from '../types/workout';
import { useLanguage } from '../contexts/LanguageContext';
import { exerciseName, localizeMinutes } from '../i18n/content';
import { haptic } from '../lib/haptics';
import { cn } from '../lib/utils';
import { VideoModal } from './ui/VideoModal';
import { getYouTubeThumbnails } from '../lib/youtube';
import { toast } from 'sonner';
import { Button } from './ui';
import { isDeloadWeek } from '../data/programConfig';

interface ExerciseCardNewProps {
  exercise: Exercise;
  index: number;
  weekNumber: number;
  savedSets?: ExerciseSet[];
  prevSets?: ExerciseSet[];
  onSave: (sets: ExerciseSet[]) => Promise<void>;
}

/** P05 exercise block: index + name, thumb, set grid cells. */
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

  const expectedCount = isDeloadWeek(weekNumber)
    ? Math.max(1, Math.floor(exercise.sets / 2))
    : exercise.sets;

  const build = (): ExerciseSet[] => {
    // Always show the full expected set count (e.g. skull crushers = 4),
    // even if a previous save only stored 3 rows.
    return Array.from({ length: expectedCount }, (_, i) => {
      const s = savedSets?.[i] ?? savedSets?.[savedSets.length - 1];
      return {
        setNumber: i + 1,
        reps: savedSets?.[i]?.reps ?? s?.targetReps ?? s?.reps ?? 0,
        weight: savedSets?.[i]?.weight ?? s?.targetWeight ?? s?.weight ?? 0,
        rpe: savedSets?.[i]?.rpe ?? 8,
        completed: savedSets?.[i]?.completed ?? false,
        targetReps: savedSets?.[i]?.targetReps ?? s?.targetReps,
        targetWeight: savedSets?.[i]?.targetWeight ?? s?.targetWeight,
      };
    });
  };

  const [sets, setSets] = useState<ExerciseSet[]>(build);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);
  const [focusCell, setFocusCell] = useState<{ row: number; field: 'weight' | 'reps' } | null>(null);

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
  const targetReps = sets[0]?.targetReps ?? exercise.reps;

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

  const handleSave = async () => {
    const allEmpty = sets.every((s) => s.reps === 0 && s.weight === 0);
    if (allEmpty) {
      toast.error(t('toast.emptySave'));
      return;
    }

    const payload = sets.map((s) => ({ ...s, rpe: 8, completed: true }));
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

  return (
    <div className="rounded-[18px] bg-surface-1 p-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-lg font-semibold tabular-nums text-brand">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-lg font-semibold leading-snug text-txt-hi">{localizedName}</h3>
      </div>

      <div className="ml-[30px] mt-2 flex flex-wrap items-center gap-2 text-[13px] font-medium text-txt-mid">
        {!isCalisthenics && targetWeight != null && (
          <span>
            {targetWeight} kg × {targetReps}
          </span>
        )}
        {isCalisthenics && targetReps != null && <span>{targetReps} reps</span>}
        {exercise.rest && (
          <span className="inline-flex items-center gap-1 text-txt-lo">
            <Timer className="h-3.5 w-3.5" strokeWidth={2} />
            {localizeMinutes(t, exercise.rest)}
          </span>
        )}
      </div>

      {/* Thumb */}
      <div className="relative mt-3.5 h-[150px] overflow-hidden rounded-xl">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: '50% 20%', filter: 'saturate(0.75) brightness(0.7)' }}
            loading="lazy"
            onError={() => setCoverIndex((i) => i + 1)}
          />
        ) : (
          <div className="h-full bg-surface-2" />
        )}
        {exercise.videoUrl && (
          <button
            type="button"
            onClick={() => {
              haptic.light();
              setShowVideo(true);
            }}
            aria-label={t('log.playVideo', { name: localizedName })}
            className="absolute left-1/2 top-1/2 grid h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[rgba(242,237,230,0.94)] text-[#111]"
          >
            <Play className="h-5 w-5 fill-current" />
          </button>
        )}
        <span className="absolute bottom-3 left-3 h-[26px] rounded-lg bg-[rgba(17,17,16,0.72)] px-2.5 text-[12px] font-semibold leading-[26px] text-txt-hi">
          {t('log.set')} {sets.length}
        </span>
      </div>

      {/* Set grid */}
      <div className="mt-4">
        <div className="grid grid-cols-[30px_1fr_86px_86px] gap-2 px-0.5 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-txt-lo">#</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-txt-lo">
            {t('log.target')}
          </span>
          <span className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-txt-lo">
            {isCalisthenics ? t('log.reps') : 'kg'}
          </span>
          <span className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-txt-lo">
            {t('log.reps')}
          </span>
        </div>

        {sets.map((set, i) => {
          const prev = prevSets?.find((p) => p.setNumber === set.setNumber);
          const tg =
            set.targetWeight != null
              ? `${set.targetWeight} × ${set.targetReps ?? targetReps}`
              : prev
                ? `${prev.weight} × ${prev.reps}`
                : `${targetWeight ?? '—'} × ${targetReps ?? '—'}`;
          const weightEmpty = !set.weight;
          const repsEmpty = !set.reps;

          return (
            <div
              key={set.setNumber}
              className={cn(
                'mt-1.5 grid h-[52px] grid-cols-[30px_1fr_86px_86px] items-center gap-2 px-0.5',
                set.completed && 'opacity-90'
              )}
            >
              <span className="text-center font-display text-lg font-semibold tabular-nums text-txt-mid">
                {set.setNumber}
              </span>
              <span className="text-sm font-medium text-txt-mid">{isCalisthenics ? `${targetReps}` : tg}</span>
              {!isCalisthenics ? (
                <Cell
                  value={set.weight || undefined}
                  placeholder={String(set.targetWeight ?? targetWeight ?? 40)}
                  empty={weightEmpty && !set.completed}
                  focused={focusCell?.row === i && focusCell.field === 'weight'}
                  done={set.completed}
                  onFocus={() => setFocusCell({ row: i, field: 'weight' })}
                  onBump={(d) => bump(i, 'weight', d, 2.5)}
                  onChange={(v) => updateSet(i, 'weight', v)}
                />
              ) : (
                <span />
              )}
              <Cell
                value={set.reps || undefined}
                placeholder={String(set.targetReps ?? targetReps ?? 10)}
                empty={repsEmpty && !set.completed}
                focused={focusCell?.row === i && focusCell.field === 'reps'}
                done={set.completed}
                onFocus={() => setFocusCell({ row: i, field: 'reps' })}
                onBump={(d) => bump(i, 'reps', d, 1)}
                onChange={(v) => updateSet(i, 'reps', v)}
              />
            </div>
          );
        })}
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="mt-3.5"
        disabled={isSaving}
        onClick={handleSave}
      >
        {isSaving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isSaved ? (
          <>
            <Check className="h-5 w-5" strokeWidth={2} /> {t('log.saved')}
          </>
        ) : savedSets?.length ? (
          t('log.update')
        ) : (
          t('log.save')
        )}
      </Button>

      <VideoModal
        open={showVideo}
        videoUrl={exercise.videoUrl}
        title={localizedName}
        onClose={() => setShowVideo(false)}
      />
    </div>
  );
}

function Cell({
  value,
  placeholder,
  empty,
  focused,
  done,
  onFocus,
  onBump,
  onChange,
}: {
  value?: number;
  placeholder: string;
  empty?: boolean;
  focused?: boolean;
  done?: boolean;
  onFocus: () => void;
  onBump: (d: number) => void;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className={cn(
        'relative grid h-12 place-items-center rounded-[10px] font-display text-2xl font-semibold tabular-nums',
        done ? 'bg-surface-3 text-txt-hi' : 'bg-surface-2 text-txt-hi',
        empty && !focused && 'text-txt-lo',
        focused && 'bg-surface-1 shadow-[inset_0_0_0_1.5px_#E8112D]'
      )}
    >
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ''}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="absolute inset-0 z-10 w-full bg-transparent text-center font-display text-2xl font-semibold tabular-nums text-txt-hi outline-none placeholder:text-txt-lo"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 opacity-0 focus-within:pointer-events-auto focus-within:opacity-100">
        <button
          type="button"
          tabIndex={-1}
          className="pointer-events-auto grid h-7 w-7 place-items-center text-txt-lo"
          onClick={() => onBump(-1)}
        >
          <Minus className="h-3 w-3" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          className="pointer-events-auto grid h-7 w-7 place-items-center text-txt-lo"
          onClick={() => onBump(1)}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
