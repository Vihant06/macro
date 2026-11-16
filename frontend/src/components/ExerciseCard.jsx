import React, { forwardRef, useState } from 'react';

const ExerciseCard = forwardRef(function ExerciseCard(
  { exercise, onCompleteSet, onAddSet },
  ref,
) {
  const completedSetsCount = exercise.completedSets || 0;
  const targetSetsCount = exercise.targetSets || 1;
  const totalSlots = Math.max(completedSetsCount + 1, targetSetsCount);

  // We maintain local state for the inputs of the active set
  const [activeInput, setActiveInput] = useState({ weight: '', reps: '' });

  const handleWeightChange = (e) => setActiveInput({ ...activeInput, weight: e.target.value });
  const handleRepsChange = (e) => setActiveInput({ ...activeInput, reps: e.target.value });

  const handleComplete = () => {
    const weight = parseFloat(activeInput.weight) || 0;
    const reps = parseInt(activeInput.reps, 10) || 0;
    if (reps > 0) {
      onCompleteSet(exercise, weight, reps);
      setActiveInput({ weight: '', reps: '' });
    }
  };

  const getMuscleGroup = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('bench') || lower.includes('chest')) return 'CHEST & TRICEPS';
    if (lower.includes('squat') || lower.includes('leg')) return 'LEGS & GLUTES';
    if (lower.includes('press') || lower.includes('shoulder')) return 'SHOULDERS';
    if (lower.includes('row') || lower.includes('pull') || lower.includes('deadlift')) return 'BACK & BICEPS';
    if (lower.includes('curl')) return 'BICEPS';
    return 'FULL BODY';
  };

  const completedSetsArray = exercise.sets || [];

  return (
    <section ref={ref} className="glass-card rounded-[2.5rem] p-7 shadow-premium border border-white/40">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-extrabold font-manrope text-on-surface leading-tight tracking-tight">
            {exercise.exerciseName}
          </h2>
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] font-inter">
            {getMuscleGroup(exercise.exerciseName)}
          </span>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100/50 text-zinc-400 hover:text-primary transition-colors border border-white/40">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_horiz</span>
        </button>
      </div>

      <div className="space-y-4">
        {totalSlots > 0 && (
          <div className="grid grid-cols-6 gap-2 px-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <span className="text-center">Set</span>
            <span className="col-span-2">Weight (kg)</span>
            <span className="col-span-2">Reps</span>
            <span />
          </div>
        )}

        <div className="space-y-3">
          {Array.from({ length: totalSlots }).map((_, idx) => {
            const isCompleted = idx < completedSetsCount;
            const isActive = idx === completedSetsCount;
            const setRecord = isCompleted ? completedSetsArray[idx] : null;

            if (isCompleted) {
              return (
                <div key={idx} className="grid grid-cols-6 gap-2 items-center bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100 opacity-80">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200/50 text-zinc-500 text-xs font-extrabold">
                    {idx + 1}
                  </div>
                  <div className="col-span-2">
                    <span className="text-xl font-extrabold font-manrope text-on-surface">{setRecord.weight}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xl font-extrabold font-manrope text-on-surface">{setRecord.reps}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                  </div>
                </div>
              );
            }

            if (isActive) {
              return (
                <div key={idx} className="grid grid-cols-6 gap-2 items-center bg-white p-4 rounded-3xl border-2 border-primary/10 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-extrabold">
                    {idx + 1}
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="w-full bg-transparent border-none p-0 text-2xl font-extrabold font-manrope focus:ring-0 placeholder:text-zinc-200"
                      placeholder="0"
                      value={activeInput.weight}
                      onChange={handleWeightChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="w-full bg-transparent border-none p-0 text-2xl font-extrabold font-manrope focus:ring-0 placeholder:text-zinc-200"
                      placeholder="0"
                      value={activeInput.reps}
                      onChange={handleRepsChange}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleComplete(); }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleComplete}
                      disabled={!activeInput.reps}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-all disabled:opacity-30 disabled:grayscale"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} className="grid grid-cols-6 gap-2 items-center bg-zinc-50/20 p-4 rounded-3xl border border-dashed border-zinc-200 opacity-40">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-300 text-xs font-extrabold">
                  {idx + 1}
                </div>
                <div className="col-span-2">
                  <span className="text-xl font-extrabold font-manrope text-zinc-300">-</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xl font-extrabold font-manrope text-zinc-300">-</span>
                </div>
                <span />
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => onAddSet(exercise.id)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 font-bold text-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center justify-center gap-2 mt-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Set
        </button>
      </div>
    </section>
  );
});


export default ExerciseCard;
