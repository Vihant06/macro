import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { workoutService } from '../services/workoutService';

const ACTIVE_WORKOUT_KEY = 'macro.activeWorkoutDraft';

const WORKOUT_TEMPLATES = {
  'Push Day A': [
    { name: 'Barbell Bench Press', sets: 4, reps: 10 },
    { name: 'Incline Dumbbell Press', sets: 3, reps: 12 },
    { name: 'Overhead Press', sets: 3, reps: 10 },
    { name: 'Tricep Pushdowns', sets: 4, reps: 15 },
  ],
  'Pull Day A': [
    { name: 'Deadlift', sets: 3, reps: 5 },
    { name: 'Pull-ups', sets: 3, reps: 8 },
    { name: 'Barbell Row', sets: 4, reps: 10 },
    { name: 'Face Pulls', sets: 3, reps: 15 },
  ],
  'Leg Day A': [
    { name: 'Barbell Squat', sets: 4, reps: 6 },
    { name: 'Romanian Deadlift', sets: 3, reps: 10 },
    { name: 'Leg Press', sets: 3, reps: 12 },
    { name: 'Calf Raises', sets: 4, reps: 15 },
  ],
};

export default function Workout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState('Push Day A');
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        const [history, active] = await Promise.all([
          workoutService.getHistory(10),
          workoutService.getActiveSession(),
        ]);
        setCompletedWorkouts(history || []);
        setActiveSession(active || null);
      } catch (error) {
        console.error('Failed to load workout data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutData();
  }, []);

  useEffect(() => {
    const completedSession = location.state?.completedSession;
    if (!completedSession) return;

    setActiveSession(null);
    setCompletedWorkouts((current) => {
      const exists = current.find(w => w.id === completedSession.id);
      if (exists) return current;
      return [completedSession, ...current].slice(0, 10);
    });
    navigate('/workout', { replace: true });
  }, [location.state, navigate]);

  const selectedExercises = useMemo(
    () =>
      (WORKOUT_TEMPLATES[selectedWorkout] || []).map((exercise) => ({
        exerciseName: exercise.name,
        targetSets: exercise.sets,
        targetReps: exercise.reps,
      })),
    [selectedWorkout],
  );

  const handleStartWorkout = () => {
    if (starting) return;
    setStarting(true);
    navigate('/workout/session', { 
      state: { 
        workoutName: selectedWorkout, 
        exercises: selectedExercises 
      } 
    });
  };

  const handleResumeWorkout = () => {
    navigate('/workout/session');
  };

  const getWeekData = () => {
    const today = new Date();
    const monday = new Date(today);
    const dayIndex = today.getDay() || 7;
    monday.setDate(today.getDate() - dayIndex + 1);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      const completed = Array.isArray(completedWorkouts) && completedWorkouts.some((workout) => {
        if (!workout.startTime) return false;
        const workoutDate = new Date(workout.startTime);
        return workoutDate.toDateString() === date.toDateString();
      });

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        completed,
        isToday: date.toDateString() === today.toDateString(),
        dateNumber: date.getDate(),
      };
    });
  };

  const weekData = getWeekData();
  const recentCompleted = Array.isArray(completedWorkouts) ? completedWorkouts : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined animate-spin text-[2rem] text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  const hasCompletedToday = recentCompleted.some((w) => {
    if (!w.endTime) return false;
    const d = new Date(w.endTime);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const totalVolume = recentCompleted.reduce((sum, w) => sum + (w.totalVolume || 0), 0);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-manrope font-extrabold text-[2.5rem] leading-tight tracking-tight text-on-surface">
            Workouts
          </h1>
          <p className="font-inter text-zinc-500 font-medium tracking-tight">Weekly Split • Hypertrophy</p>
        </div>
        <div className="bg-primary/5 p-2 rounded-2xl border border-primary/10">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>calendar_today</span>
        </div>
      </div>

      {/* active Session Banner */}
      {activeSession && (
        <div 
            onClick={handleResumeWorkout}
            className="glass-card rounded-[2rem] p-6 shadow-premium border-l-4 border-l-primary cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="flex justify-between items-center gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">Active Session</span>
              <h2 className="font-manrope font-bold text-xl">{activeSession.workoutName}</h2>
              <div className="flex items-center gap-2 mt-2 text-zinc-500 text-xs font-medium">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>Started {new Date(activeSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">play_arrow</span>
            </div>
          </div>
        </div>
      )}

      {/* Weekly View */}
      <div className="glass-card rounded-[2rem] p-6 shadow-premium">
        <div className="flex justify-between">
          {weekData.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <span className={`text-[11px] font-bold uppercase ${day.isToday ? 'text-primary' : 'text-zinc-400'}`}>
                {day.day}
              </span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  day.completed 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : day.isToday 
                      ? 'border-2 border-primary text-primary bg-primary/5' 
                      : 'border border-dashed border-zinc-300 text-zinc-300'
                }`}
              >
                {day.completed ? (
                  <span className="material-symbols-outlined text-lg">check</span>
                ) : (
                  <span className="text-sm font-bold">{day.dateNumber}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Selection */}
      <section>
        <div className="flex justify-between items-center mb-5">
            <h2 className="font-manrope font-bold text-2xl tracking-tight text-on-surface">Select Workout</h2>
            <button className="text-sm font-bold text-primary">View All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 no-scrollbar">
          {Object.keys(WORKOUT_TEMPLATES).map((workout) => (
            <button
              key={workout}
              onClick={() => setSelectedWorkout(workout)}
              className={`px-6 py-3.5 rounded-[1.5rem] font-bold text-sm whitespace-nowrap transition-all ${
                selectedWorkout === workout 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white/60 text-on-surface-variant border border-white/40 hover:bg-white/80'
              }`}
            >
              {workout}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 shadow-premium mt-2">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
                </div>
                <div>
                    <h3 className="font-manrope font-bold text-xl">{selectedWorkout}</h3>
                    <p className="text-zinc-500 text-sm font-medium">{WORKOUT_TEMPLATES[selectedWorkout].length} Exercises • ~45 min</p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                {WORKOUT_TEMPLATES[selectedWorkout].slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-on-surface-variant">{ex.name}</span>
                        <span className="text-zinc-400 font-medium">{ex.sets} × {ex.reps}</span>
                    </div>
                ))}
                {WORKOUT_TEMPLATES[selectedWorkout].length > 3 && (
                    <p className="text-primary text-xs font-bold font-manrope">+ {WORKOUT_TEMPLATES[selectedWorkout].length - 3} more exercises</p>
                )}
            </div>

            <button
                onClick={handleStartWorkout}
                disabled={starting}
                className="w-full btn-primary py-4 text-base shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined">play_circle</span>
                {starting ? 'Initializing...' : 'Start Workout Session'}
            </button>
        </div>
      </section>

      {/* Recent Activity */}
      {recentCompleted.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-manrope font-bold text-2xl tracking-tight text-on-surface">Recent Activity</h2>
            <button className="text-sm font-bold text-primary">View All</button>
          </div>
          <div className="space-y-4">
            {recentCompleted.slice(0, 5).map((w) => (
              <div key={w.id} className="flex items-center justify-between p-5 bg-zinc-50/50 rounded-[2rem] border border-zinc-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary border border-zinc-100 shadow-sm">
                    <span className="material-symbols-outlined">event_note</span>
                  </div>
                  <div>
                    <h4 className="font-manrope font-extrabold text-on-surface">{w.workoutName}</h4>
                    <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                        {new Date(w.endTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-primary font-manrope font-extrabold">
                        {w.totalVolume?.toLocaleString() || 0} kg
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Total Volume</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
