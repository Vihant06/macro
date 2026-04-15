import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExerciseCard from './ExerciseCard';
import { workoutService } from '../services/workoutService';

const ACTIVE_WORKOUT_KEY = 'macro.activeWorkoutDraft';
const ACTIVE_WORKOUT_SESSION_KEY = 'macro.activeWorkoutSession';

export default function WorkoutSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const draft = location.state || JSON.parse(localStorage.getItem(ACTIVE_WORKOUT_KEY) || 'null');

  const [session, setSession] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState('');
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', sets: 3, reps: 10 });
  

  const handleAddExercise = async () => {
    const sessionId = session?.id || session?._id;
    if (!newExercise.name.trim() || !sessionId) {
      if (!sessionId) {
        setError('Session not initialized. Please refresh.');
      }
      return;
    }
    
    setError('');
    try {
      const exercise = await workoutService.addExercise(
        sessionId,
        newExercise.name,
        newExercise.sets,
        newExercise.reps,
      );
      setExercises((current) => [...current, exercise]);
      setNewExercise({ name: '', sets: 3, reps: 10 });
      setShowAddExercise(false);
    } catch (addError) {
      console.error('Failed to add exercise:', addError);
      setError('Could not add exercise. Please try again.');
    }
  };

  useEffect(() => {
    const initWorkout = async () => {
      try {
        const active = await workoutService.getActiveSession();
        if (active && active.id) {
          setSession(active);
          localStorage.setItem(
            ACTIVE_WORKOUT_SESSION_KEY,
            JSON.stringify({ id: active.id, workoutName: active.workoutName }),
          );
          const sessionExercises = await workoutService.getSessionExercises(active.id);
          setExercises(sessionExercises || []);
          return;
        }

        // Clean up stale empty session if it exists
        if (active && Object.keys(active).length === 0) {
          localStorage.removeItem(ACTIVE_WORKOUT_SESSION_KEY);
        }

        if (!draft?.workoutName) {
          console.log('No active session and no draft found, redirecting...');
          navigate('/workout');
          return;
        }

        const newSession = await workoutService.startWorkout(draft.workoutName, draft.exercises || []);
        if (newSession && newSession.id) {
            setSession(newSession);
            localStorage.setItem(
              ACTIVE_WORKOUT_SESSION_KEY,
              JSON.stringify({ id: newSession.id, workoutName: newSession.workoutName }),
            );
            localStorage.removeItem(ACTIVE_WORKOUT_KEY);

            const sessionExercises = await workoutService.getSessionExercises(newSession.id);
            setExercises(sessionExercises || []);
        } else {
            throw new Error('Backend failed to create a valid session ID');
        }
      } catch (initError) {
        console.error('Failed to initialize workout:', initError);
        
        if (initError.response?.status === 401) {
            setError('Your login session expired. Please log in again.');
            // Add a slight delay before redirect to show the message
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        const message = initError.response?.data?.message || initError.message;
        setError(`Unable to start your workout: ${message}`);
        
        // If critical failure, allow user to return home
        setTimeout(() => {
            if (!session) navigate('/workout');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    initWorkout();
  }, [draft, navigate]);


  const handleEndWorkout = async () => {
    if (!session || isEnding) return;

    setIsEnding(true);
    setError('');
    try {
      const endedSession = await workoutService.endWorkout(session.id);
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
      localStorage.removeItem(ACTIVE_WORKOUT_SESSION_KEY);
      navigate('/workout', { state: { completedSession: endedSession } });
    } catch (endError) {
      console.error('Failed to end workout:', endError);
      setError('Could not finish workout. Please try again.');
      setIsEnding(false);
    }
  };

  const handleDiscardWorkout = async () => {
    if (!session || isEnding) return;
    if (!window.confirm('Discard this workout? All progress will be lost.')) return;
    
    setIsEnding(true);
    try {
      await workoutService.endWorkout(session.id);
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
      localStorage.removeItem(ACTIVE_WORKOUT_SESSION_KEY);
      navigate('/workout');
    } catch (err) {
      console.error(err);
      navigate('/workout');
    }
  };

  const handleAddSet = (exerciseId) => {
    setExercises((current) => 
      current.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            targetSets: (ex.targetSets || 0) + 1
          };
        }
        return ex;
      })
    );
  };

  const handleCompleteSet = async (exercise, parsedWeight, parsedReps) => {
    if (!session) return;

    const previousExercises = exercises;

    try {
      // Optimistic update
      const optimisticSet = {
        completed: true,
        weight: parsedWeight,
        reps: parsedReps,
        timestamp: new Date().toISOString(),
      };

      setExercises((current) => current.map((currEx) => {
        if (currEx.id !== exercise.id) return currEx;
        const nextSets = [...(currEx.sets || []), optimisticSet];
        return {
          ...currEx,
          sets: nextSets,
          totalVolume: (currEx.totalVolume || 0) + parsedWeight * parsedReps,
          completedSets: (currEx.completedSets || 0) + 1,
        };
      }));

      const updatedExercise = await workoutService.completeSet(
        session.id,
        exercise.exerciseName,
        parsedWeight,
        parsedReps,
      );

      setExercises((current) =>
        current.map((item) => (item.id === exercise.id ? updatedExercise : item)),
      );
    } catch (completeError) {
      console.error('Failed to complete set:', completeError);
      setExercises(previousExercises);
      setError('Set could not be saved. Please retry.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-[3rem] text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto pb-32">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl px-6 py-4 border-b border-white/20 mb-6">
        <div className="flex justify-between items-center">
            <h1 className="text-[2rem] font-manrope font-extrabold leading-none tracking-tight text-on-surface">
              {session?.workoutName || 'Workout'}
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={handleEndWorkout}
                disabled={isEnding || exercises.length === 0}
                className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                Finish
              </button>
            </div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {error && (
          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-error mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-error text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Exercises List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-manrope font-bold text-on-surface tracking-tight">Exercises</h2>
            <button 
              onClick={() => setShowAddExercise(!showAddExercise)}
              className="px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold text-sm flex items-center gap-2 border border-primary/10 hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[1rem]">add_circle</span>
              Add New
            </button>
          </div>

          {showAddExercise && (
            <div className="glass-card rounded-[2rem] p-6 border border-white/40 shadow-premium">
              <h3 className="font-bold font-manrope text-lg mb-4 text-on-surface">New Exercise</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Exercise Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Incline Bench Press"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    className="w-full bg-white/50 border border-zinc-200 p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 text-base font-bold outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Sets</label>
                    <input
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-white/50 border border-zinc-200 p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 text-base font-bold outline-none text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Reps</label>
                    <input
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-white/50 border border-zinc-200 p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 text-base font-bold outline-none text-center"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handleAddExercise}
                    className="flex-1 btn-primary py-4 rounded-2xl text-base shadow-lg shadow-primary/20"
                  >
                    Add to Workout
                  </button>
                  <button 
                    onClick={() => setShowAddExercise(false)}
                    className="px-6 py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onCompleteSet={handleCompleteSet}
                onAddSet={handleAddSet}
              />
            ))}
          </div>

          {exercises.length === 0 && (
            <div className="glass-card rounded-[2.5rem] p-12 text-center border border-dashed border-zinc-300">
              <span className="material-symbols-outlined text-[4rem] text-zinc-200 mb-4">fitness_center</span>
              <p className="text-zinc-400 font-bold font-manrope text-lg">Your workout is empty</p>
              <button 
                onClick={() => setShowAddExercise(true)}
                className="mt-4 text-primary font-bold text-sm underline underline-offset-4"
              >
                Add your first exercise
              </button>
            </div>
          )}

          {/* Action Footer */}
          {exercises.length > 0 && (
            <div className="pt-10 flex flex-col gap-4">
              <button 
                onClick={handleEndWorkout}
                disabled={isEnding}
                className="w-full btn-primary py-5 rounded-[2.5rem] text-lg shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
              >
                {isEnding ? 'Saving Workout...' : 'Finish Workout'}
              </button>
              <button 
                onClick={handleDiscardWorkout}
                disabled={isEnding}
                className="w-full text-zinc-400 font-bold text-sm py-4 hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                Discard Workout Session
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

