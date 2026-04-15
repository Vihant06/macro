import { FoodService } from './food.service';
import { CreateFoodEntryDto, UpdateFoodEntryDto, GetFoodEntriesDto } from './dto/create-food-entry.dto';
export declare class FoodController {
    private foodService;
    constructor(foodService: FoodService);
    create(userId: string, createFoodEntryDto: CreateFoodEntryDto): Promise<import("./schemas/food-entry.schema").FoodEntry>;
    findAll(userId: string, query: GetFoodEntriesDto): Promise<{
        id: any;
        userId: string;
        date: Date;
        mealType: import("./schemas/food-entry.schema").MealType;
        foodName: string;
        servingSize: number;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        recipeId: string | undefined;
    }[]>;
    getDailyTotals(userId: string, date: string): Promise<{
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        date: string;
        entries: number;
    }>;
    findOne(userId: string, id: string): Promise<import("./schemas/food-entry.schema").FoodEntry>;
    update(userId: string, id: string, updateDto: UpdateFoodEntryDto): Promise<import("./schemas/food-entry.schema").FoodEntry>;
    remove(userId: string, id: string): Promise<void>;
}
