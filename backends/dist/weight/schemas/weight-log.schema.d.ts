import { Document, HydratedDocument } from 'mongoose';
export type WeightLogDocument = HydratedDocument<WeightLog>;
export declare class WeightLog extends Document {
    userId: string;
    date: Date;
    weight: number;
    bodyFatPercentage?: number;
    notes?: string;
}
export declare const WeightLogSchema: import("mongoose").Schema<WeightLog, import("mongoose").Model<WeightLog, any, any, any, Document<unknown, any, WeightLog> & WeightLog & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeightLog, Document<unknown, {}, import("mongoose").FlatRecord<WeightLog>> & import("mongoose").FlatRecord<WeightLog> & {
    _id: import("mongoose").Types.ObjectId;
}>;
