import { Document, HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
export type RecipeDocument = HydratedDocument<Recipe>;
export declare class Recipe extends Document {
    userId: string;
    name: string;
    description?: string;
    servings: number;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    ingredients: RecipeIngredient[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    tags: string[];
    isPublic: boolean;
}
export declare class RecipeIngredient {
    name: string;
    amount: number;
    unit: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}
export declare const RecipeSchema: import("mongoose").Schema<Recipe, import("mongoose").Model<Recipe, any, any, any, Document<unknown, any, Recipe> & Recipe & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Recipe, Document<unknown, {}, import("mongoose").FlatRecord<Recipe>> & import("mongoose").FlatRecord<Recipe> & {
    _id: Types.ObjectId;
}>;
