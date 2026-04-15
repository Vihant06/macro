import { Document, HydratedDocument } from 'mongoose';
import { Gender, ActivityLevel, Goal } from '../dto/update-user.dto';
export type UserDocument = HydratedDocument<User>;
export declare class User extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    avatarUrl?: string;
    age?: number;
    gender?: Gender;
    height?: number;
    weight?: number;
    bodyFat?: number;
    activityLevel: ActivityLevel;
    goal: Goal;
    dailyCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    refreshToken?: string;
    refreshTokenExpiresAt?: Date;
    aiRequestCount: number;
    lastAiRequestDate?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
