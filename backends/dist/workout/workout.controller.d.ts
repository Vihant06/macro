import { WorkoutService } from './workout.service';
import { CreateWorkoutDto, AddExerciseDto, CompleteSetDto, UpdateWorkoutDto } from './dto/create-workout.dto';
export declare class WorkoutController {
    private workoutService;
    constructor(workoutService: WorkoutService);
    start(userId: string, createWorkoutDto: CreateWorkoutDto): Promise<any>;
    getActive(userId: string): Promise<any>;
    addExercise(userId: string, sessionId: string, addExerciseDto: AddExerciseDto): Promise<any>;
    completeSet(userId: string, sessionId: string, completeSetDto: CompleteSetDto): Promise<any>;
    getSessionExercises(userId: string, sessionId: string): Promise<any[]>;
    update(userId: string, sessionId: string, updateData: UpdateWorkoutDto): Promise<any>;
    updateProgress(userId: string, sessionId: string, updateData: UpdateWorkoutDto): Promise<any>;
    end(userId: string, sessionId: string): Promise<any>;
    getHistory(userId: string, limit?: string): Promise<any[]>;
}
