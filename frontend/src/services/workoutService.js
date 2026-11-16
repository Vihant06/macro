import api from './api';

/**
 * Workout service — matches NestJS WorkoutController
 *
 * POST   /workout/start         -> start workout session
 * GET    /workout/active        -> get active session
 * GET    /workout/history       -> get workout history
 * POST   /workout/:id/exercise  -> add exercise to session
 * POST   /workout/:id/complete-set -> complete a set
 * GET    /workout/:id/exercises -> get session exercises
 * PATCH  /workout/:id           -> update session
 * POST   /workout/:id/end       -> end workout session
 */
const extractData = (envelope) => {
  if (envelope && envelope.data && envelope.success !== undefined) {
    // If it's a session object, check for ID
    const data = envelope.data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (Object.keys(data).length === 0) return null;
    }
    return data;
  }
  return envelope;
};

export const workoutService = {
  async startWorkout(workoutName, exercises) {
    const { data: envelope } = await api.post('/workout/start', { workoutName, exercises });
    return extractData(envelope);
  },

  async getActiveSession() {
    const { data: envelope } = await api.get('/workout/active');
    return extractData(envelope);
  },

  async addExercise(sessionId, exerciseName, targetSets = 3, targetReps = 10, notes = '') {
    const { data: envelope } = await api.post(`/workout/${sessionId}/exercise`, {
      exerciseName,
      targetSets,
      targetReps,
      notes,
    });
    return extractData(envelope);
  },

  async completeSet(sessionId, exerciseName, weight, reps) {
    const { data: envelope } = await api.post(`/workout/${sessionId}/complete-set`, {
      exerciseName,
      weight,
      reps,
    });
    return extractData(envelope);
  },

  async getSessionExercises(sessionId) {
    const { data: envelope } = await api.get(`/workout/${sessionId}/exercises`);
    return extractData(envelope);
  },

  async updateSession(sessionId, updates) {
    const { data: envelope } = await api.patch(`/workout/${sessionId}`, updates);
    return extractData(envelope);
  },

  async endWorkout(sessionId) {
    const { data: envelope } = await api.post(`/workout/${sessionId}/end`);
    return extractData(envelope);
  },

  async getHistory(limit = 10) {
    const { data: envelope } = await api.get('/workout/history', { params: { limit } });
    return extractData(envelope);
  },
};
