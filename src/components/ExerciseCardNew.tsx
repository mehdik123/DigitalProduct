import { useState, useEffect } from 'react';
import { Exercise, ExerciseSet } from '../types/workout';
import { Save, Check, Loader2, Play, Info, MoreVertical } from 'lucide-react';

interface ExerciseCardNewProps {
  exercise: Exercise;
  index: number;
  savedSets?: ExerciseSet[];
  onSave: (sets: ExerciseSet[]) => Promise<void>;
}

export default function ExerciseCardNew({ exercise, index, savedSets, onSave }: ExerciseCardNewProps) {
  const [sets, setSets] = useState<ExerciseSet[]>(() => {
    // Initialize from saved data or create defaults
    if (savedSets && savedSets.length > 0) {
      return savedSets;
    }
    return Array.from({ length: exercise.sets }, (_, i) => ({
      setNumber: i + 1,
      reps: 0,
      weight: 0,
      completed: false
    }));
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Update when savedSets change
  useEffect(() => {
    if (savedSets && savedSets.length > 0) {
      setSets(savedSets);
      setIsSaved(true);
    }
  }, [savedSets]);

  const updateSet = (setIndex: number, field: 'reps' | 'weight', value: number) => {
    setSets(prev => prev.map((set, i) =>
      i === setIndex ? { ...set, [field]: value } : set
    ));
    setIsSaved(false);
  };

  const handleSave = async () => {
    const hasData = sets.some(s => s.reps > 0 || s.weight > 0);
    if (!hasData) {
      alert('Please enter at least some reps or weight');
      return;
    }

    setIsSaving(true);
    setIsSaved(false);

    // Safety timeout
    const timeout = setTimeout(() => {
      setIsSaving(false);
      console.error('Save operation timed out after 20s');
      alert('Save request timed out. Please check your internet connection.');
    }, 20000);

    try {
      console.log('Saving sets:', sets);
      await onSave(sets.map(s => ({ ...s, completed: true })));
      console.log('Save successful');
      clearTimeout(timeout);
      setIsSaved(true);
    } catch (error: any) {
      clearTimeout(timeout);
      console.error('Save failed:', error);
      alert(error.message || 'Failed to save');
      setIsSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-2xl transition-all duration-300 hover:border-red-500/20">

      {/* Background Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none" />

      {/* Media Header */}
      <div className="relative h-48 w-full overflow-hidden">
        {exercise.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

        {/* Floating Play Button */}
        {exercise.videoUrl && (
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 p-3 bg-red-600/90 hover:bg-red-500 backdrop-blur-xl rounded-full text-white shadow-lg shadow-red-900/40 transition-all hover:scale-110 active:scale-95 z-10"
          >
            <Play className="w-5 h-5 fill-current" />
          </a>
        )}

        {/* Title Content */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-300 border border-white/10">
              Set {index + 1}
            </span>
            <span className="px-2 py-0.5 bg-red-600/20 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-widest text-red-400 border border-red-500/20">
              {exercise.sets} x {exercise.reps}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white leading-none">
            {exercise.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 md:p-6 space-y-6 relative bg-gradient-to-b from-zinc-900/50 to-transparent">

        {/* Notes Toggle */}
        {exercise.notes && (
          <div className={`text-sm text-zinc-400 bg-zinc-800/50 rounded-xl p-3 border border-white/5 transition-all ${showNotes ? 'opacity-100' : 'opacity-70'}`}>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
              <p className="leading-relaxed">{exercise.notes}</p>
            </div>
          </div>
        )}

        {/* Sets Grid */}
        <div className="space-y-3">
          {sets.map((set, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* Set Badge */}
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-500 font-bold text-xs border border-white/5">
                {set.setNumber}
              </div>

              {/* Input Container */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="relative group/input">
                  <label className="absolute -top-2 left-2 px-1 bg-zinc-900/90 text-[9px] font-bold text-zinc-500 uppercase tracking-wider transition-colors group-focus-within/input:text-red-500">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(i, 'reps', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-zinc-950/50 border border-white/5 text-center text-white font-bold p-3 rounded-xl focus:outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-zinc-700"
                  />
                </div>
                <div className="relative group/input">
                  <label className="absolute -top-2 left-2 px-1 bg-zinc-900/90 text-[9px] font-bold text-zinc-500 uppercase tracking-wider transition-colors group-focus-within/input:text-red-500">
                    Lbs
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(i, 'weight', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-zinc-950/50 border border-white/5 text-center text-white font-bold p-3 rounded-xl focus:outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full relative group/btn overflow-hidden rounded-xl py-4 font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 ${isSaved
            ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:bg-emerald-500'
            : 'bg-white text-black hover:bg-neutral-200'
            }`}
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-5 h-5" />
                <span>Update Log</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{savedSets && savedSets.length > 0 ? 'Update Log' : 'Log Set'}</span>
              </>
            )}
          </div>

          {/* Shimmer Effect */}
          {!isSaving && (
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-12" />
          )}
        </button>

      </div>
    </div>
  );
}
