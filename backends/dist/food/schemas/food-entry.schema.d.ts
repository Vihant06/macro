import { Document, HydratedDocument } from 'mongoose';
export type FoodEntryDocument = HydratedDocument<FoodEntry>;
export declare enum MealType {
    BREAKFAST = "breakfast",
    LUNCH = "lunch",
    DINNER = "dinner",
    SNACK = "snack"
}
export declare class FoodEntry extends Document {
    userId: string;
    date: Date;
    mealType: MealType;
    foodName: string;
    servingSize: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recipeId?: string;
}
export declare const FoodEntrySchema: import("mongoose").Schema<FoodEntry, import("mongoose").Model<FoodEntry, any, any, any, Document<unknown, any, FoodEntry> & FoodEntry & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FoodEntry, Document<unknown, {}, import("mongoose").FlatRecord<FoodEntry>> & import("mongoose").FlatRecord<FoodEntry> & {
    _id: import("mongoose").Types.ObjectId;
}>;
