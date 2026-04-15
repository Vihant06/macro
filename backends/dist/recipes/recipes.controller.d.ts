import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/create-recipe.dto';
export declare class RecipesController {
    private recipesService;
    constructor(recipesService: RecipesService);
    create(userId: string, createRecipeDto: CreateRecipeDto): Promise<import("./schemas/recipe.schema").Recipe>;
    findAll(userId: string, tag?: string, search?: string, limit?: string): Promise<{
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
    findOne(userId: string, id: string): Promise<import("./schemas/recipe.schema").Recipe>;
    update(userId: string, id: string, updateRecipeDto: UpdateRecipeDto): Promise<import("./schemas/recipe.schema").Recipe>;
    remove(userId: string, id: string): Promise<void>;
}
