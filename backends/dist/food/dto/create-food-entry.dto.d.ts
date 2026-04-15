import { MealType } from '../schemas/food-entry.schema';
export declare class CreateFoodEntryDto {
    foodName: string;
    mealType: MealType;
    date: string;
    servingSize: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recipeId?: string;
}
export declare class UpdateFoodEntryDto {
    foodName?: string;
    mealType?: MealType;
    servingSize?: number;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}
export declare class GetFoodEntriesDto {
    date?: string;
    mealType?: MealType;
}
