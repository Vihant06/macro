import { Document, HydratedDocument } from 'mongoose';
export type WorkoutSessionDocument = HydratedDocument<WorkoutSession>;
export declare class WorkoutSession extends Document {
    userId: string;
    workoutName?: string;
    startTime: Date;
    endTime: Date;
    status: string;
    exercises: any[];
    totalVolume: number;
    duration: number;
    totalDuration: number;
}
export declare const WorkoutSessionSchema: import("mongoose").Schema<WorkoutSession, import("mongoose").Model<WorkoutSession, any, any, any, Document<unknown, any, WorkoutSession> & WorkoutSession & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WorkoutSession, Document<unknown, {}, import("mongoose").FlatRecord<WorkoutSession>> & import("mongoose").FlatRecord<WorkoutSession> & {
    _id: import("mongoose").Types.ObjectId;
}>;
