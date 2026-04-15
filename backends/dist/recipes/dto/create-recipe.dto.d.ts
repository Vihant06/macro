export declare class RecipeIngredientDto {
    name: string;
    amount: number;
    unit: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}
export declare class CreateRecipeDto {
    name: string;
    description?: string;
    servings: number;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    ingredients?: RecipeIngredientDto[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    tags?: string[];
    isPublic?: boolean;
}
export declare class UpdateRecipeDto {
    name?: string;
    description?: string;
    servings?: number;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    ingredients?: RecipeIngredientDto[];
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    tags?: string[];
    isPublic?: boolean;
}
