export declare class WorkoutExerciseDto {
    exerciseName: string;
    targetSets: number;
    targetReps: number;
    notes?: string;
}
export declare class CreateWorkoutDto {
    workoutName?: string;
    exercises?: WorkoutExerciseDto[];
}
export declare class UpdateWorkoutDto {
    workoutName?: string;
    exercises?: WorkoutExerciseDto[];
    status?: 'active' | 'completed' | 'paused';
}
export declare class AddExerciseDto {
    exerciseName: string;
    notes?: string;
    targetSets?: number;
    targetReps?: number;
}
export declare class CompleteSetDto {
    weight?: number;
    reps?: number;
    exerciseName: string;
}
