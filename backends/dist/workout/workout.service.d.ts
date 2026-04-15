import { Model } from 'mongoose';
import { WorkoutSessionDocument } from './schemas/workout-session.schema';
import { ExerciseLogDocument } from './schemas/exercise-log.schema';
import { CreateWorkoutDto, AddExerciseDto, CompleteSetDto, UpdateWorkoutDto } from './dto/create-workout.dto';
export declare class WorkoutService {
    private workoutSessionModel;
    private exerciseLogModel;
    constructor(workoutSessionModel: Model<WorkoutSessionDocument>, exerciseLogModel: Model<ExerciseLogDocument>);
    start(userId: string, createWorkoutDto: CreateWorkoutDto): Promise<any>;
    getActiveSession(userId: string): Promise<any>;
    updateProgress(userId: string, sessionId: string, updateData: UpdateWorkoutDto): Promise<any>;
    addExercise(userId: string, sessionId: string, addExerciseDto: AddExerciseDto): Promise<any>;
    completeSet(userId: string, sessionId: string, exerciseName: string, completeSetDto: CompleteSetDto): Promise<any>;
    update(userId: string, sessionId: string, updateData: UpdateWorkoutDto): Promise<any>;
    end(userId: string, sessionId: string): Promise<any>;
    getHistory(userId: string, limit?: number): Promise<any[]>;
    getSessionExercises(userId: string, sessionId: string): Promise<any[]>;
    private updateSessionVolume;
    private serializeSession;
    private serializeExercise;
}
