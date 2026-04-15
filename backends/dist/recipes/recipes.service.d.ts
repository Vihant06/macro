import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/create-recipe.dto';
export declare class RecipesService {
    private recipeModel;
    constructor(recipeModel: Model<RecipeDocument>);
    create(userId: string, createRecipeDto: CreateRecipeDto): Promise<Recipe>;
    findAll(userId: string, options?: {
        tag?: string;
        search?: string;
        limit?: number;
    }): Promise<{
        id: any;
        userId: string;
        name: string;
        description: string | undefined;
        servings: number;
        prepTimeMinutes: number | undefined;
        cookTimeMinutes: number | undefined;
        ingredients: import("./schemas/recipe.schema").RecipeIngredient[];
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        tags: string[];
        isPublic: boolean;
    }[]>;
    findOne(userId: string, recipeId: string): Promise<Recipe>;
    update(userId: string, recipeId: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe>;
    remove(userId: string, recipeId: string): Promise<void>;
    findById(recipeId: string): Promise<Recipe | null>;
    private serializeRecipe;
}
