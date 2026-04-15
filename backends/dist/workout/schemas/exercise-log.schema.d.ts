import { Document, HydratedDocument } from 'mongoose';
export type ExerciseLogDocument = HydratedDocument<ExerciseLog>;
export declare class ExerciseLog extends Document {
    userId: string;
    sessionId: string;
    exerciseName: string;
    targetSets: number;
    targetReps: number;
    sets: Array<{
        completed: boolean;
        weight: number;
        reps: number;
        timestamp: Date;
    }>;
    notes?: string;
    totalVolume: number;
}
export declare const ExerciseLogSchema: import("mongoose").Schema<ExerciseLog, import("mongoose").Model<ExerciseLog, any, any, any, Document<unknown, any, ExerciseLog> & ExerciseLog & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ExerciseLog, Document<unknown, {}, import("mongoose").FlatRecord<ExerciseLog>> & import("mongoose").FlatRecord<ExerciseLog> & {
    _id: import("mongoose").Types.ObjectId;
}>;
