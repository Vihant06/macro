import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkoutSession, WorkoutSessionDocument } from './schemas/workout-session.schema';
import { ExerciseLog, ExerciseLogDocument } from './schemas/exercise-log.schema';
import {
  CreateWorkoutDto,
  AddExerciseDto,
  CompleteSetDto,
  UpdateWorkoutDto,
} from './dto/create-workout.dto';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectModel(WorkoutSession.name)
    private workoutSessionModel: Model<WorkoutSessionDocument>,
    @InjectModel(ExerciseLog.name)
    private exerciseLogModel: Model<ExerciseLogDocument>,
  ) {}

  /**
   * Start a new workout session
   */
  async start(userId: string, createWorkoutDto: CreateWorkoutDto): Promise<any> {
    const activeSession = await this.workoutSessionModel
      .findOne({ userId, status: 'active' })
      .sort({ startTime: -1 })
      .exec();

    if (activeSession) {
      return this.serializeSession(activeSession);
    }

    const session = await this.workoutSessionModel.create({
      userId,
      workoutName: createWorkoutDto.workoutName || 'Workout Session',
      exercises: [],
      startTime: new Date(),
      status: 'active',
    });

    if (createWorkoutDto.exercises?.length) {
      const exerciseLogs = await this.exerciseLogModel.insertMany(
        createWorkoutDto.exercises.map((exercise) => ({
          userId,
          sessionId: session._id.toString(),
          exerciseName: exercise.exerciseName,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          notes: exercise.notes || '',
          sets: [],
          totalVolume: 0,
        })),
      );

      session.exercises = exerciseLogs.map((exercise) => exercise._id.toString());
      await session.save();
    }

    return this.serializeSession(session);
  }

  /**
   * Get active workout session for user
   */
  async getActiveSession(userId: string): Promise<any> {
    const session = await this.workoutSessionModel
      .findOne({ userId, status: 'active' })
      .sort({ startTime: -1 })
      .exec();

    if (!session) return null;

    return this.serializeSession(session);
  }

  /**
   * Update workout progress without ending the session
   */
  async updateProgress(
    userId: string,
    sessionId: string,
    updateData: UpdateWorkoutDto,
  ): Promise<any> {
    return this.update(userId, sessionId, updateData);
  }

  /**
   * Add exercise to workout session
   */
  async addExercise(
    userId: string,
    sessionId: string,
    addExerciseDto: AddExerciseDto,
  ): Promise<any> {
    const session = await this.workoutSessionModel.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new NotFoundException('Workout session not found');
    }

    const exerciseLog = await this.exerciseLogModel.create({
      userId,
      sessionId,
      exerciseName: addExerciseDto.exerciseName,
      targetSets: addExerciseDto.targetSets || 3,
      targetReps: addExerciseDto.targetReps || 10,
      notes: addExerciseDto.notes,
      sets: [],
    });

    await this.workoutSessionModel.findByIdAndUpdate(sessionId, {
      $push: { exercises: exerciseLog._id.toString() },
    });

    return this.serializeExercise(exerciseLog);
  }

  /**
   * Complete a set for an exercise
   */
  async completeSet(
    userId: string,
    sessionId: string,
    exerciseName: string,
    completeSetDto: CompleteSetDto,
  ): Promise<any> {
    const exercise = await this.exerciseLogModel.findOne({
      sessionId,
      exerciseName,
      userId,
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found in this session');
    }

    const newSet = {
      completed: true,
      weight: completeSetDto.weight || 0,
      reps: completeSetDto.reps || 0,
      timestamp: new Date(),
    };

    exercise.sets.push(newSet);
    exercise.totalVolume += (completeSetDto.weight || 0) * (completeSetDto.reps || 0);

    await exercise.save();

    await this.updateSessionVolume(sessionId);

    return this.serializeExercise(exercise);
  }

  /**
   * Update workout session
   */
  async update(
    userId: string,
    sessionId: string,
    updateData: UpdateWorkoutDto,
  ): Promise<any> {
    const session = await this.workoutSessionModel
      .findOneAndUpdate(
        { _id: sessionId, userId },
        updateData,
        { new: true, runValidators: true },
      )
      .exec();

    if (!session) {
      throw new NotFoundException('Workout session not found');
    }

    return this.serializeSession(session);
  }

  /**
   * End workout session
   */
  async end(userId: string, sessionId: string): Promise<any> {
    const session = await this.workoutSessionModel.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new NotFoundException('Workout session not found');
    }

    session.endTime = new Date();
    session.status = 'completed';
    session.duration = Math.floor(
      (session.endTime.getTime() - session.startTime.getTime()) / 1000,
    );
    session.totalDuration = session.duration;

    await session.save();

    return this.serializeSession(session);
  }

  /**
   * Get workout history for user
   */
  async getHistory(userId: string, limit: number = 10): Promise<any[]> {
    const sessions = await this.workoutSessionModel
      .find({ userId, status: 'completed' })
      .sort({ startTime: -1 })
      .limit(limit)
      .exec();

    return sessions.map((session) => this.serializeSession(session));
  }

  /**
   * Get exercises for a session
   */
  async getSessionExercises(userId: string, sessionId: string): Promise<any[]> {
    const exercises = await this.exerciseLogModel
      .find({ sessionId, userId })
      .exec();

    return exercises.map((exercise) => this.serializeExercise(exercise));
  }

  /**
   * Update session total volume
   */
  private async updateSessionVolume(sessionId: string): Promise<void> {
    const exercises = await this.exerciseLogModel.find({ sessionId });
    const totalVolume = exercises.reduce((sum, ex) => sum + (ex.totalVolume || 0), 0);

    await this.workoutSessionModel.findByIdAndUpdate(sessionId, { totalVolume });
  }

  private serializeSession(session: WorkoutSessionDocument) {
    return {
      id: session._id.toString(),
      userId: session.userId,
      workoutName: session.workoutName,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
      exercises: session.exercises,
      exerciseCount: session.exercises.length,
      totalVolume: session.totalVolume,
      duration: session.duration,
      totalDuration: session.totalDuration || session.duration,
    };
  }

  private serializeExercise(exercise: ExerciseLogDocument) {
    return {
      id: exercise._id.toString(),
      userId: exercise.userId,
      sessionId: exercise.sessionId,
      exerciseName: exercise.exerciseName,
      targetSets: exercise.targetSets,
      targetReps: exercise.targetReps,
      sets: exercise.sets,
      notes: exercise.notes,
      totalVolume: exercise.totalVolume,
      completedSets: exercise.sets.filter((s) => s.completed).length,
    };
  }
}
