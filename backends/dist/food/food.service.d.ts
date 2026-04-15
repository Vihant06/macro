import { Model } from 'mongoose';
import { FoodEntry, FoodEntryDocument } from './schemas/food-entry.schema';
import { CreateFoodEntryDto, UpdateFoodEntryDto } from './dto/create-food-entry.dto';
export declare class FoodService {
    private foodEntryModel;
    constructor(foodEntryModel: Model<FoodEntryDocument>);
    create(userId: string, createFoodEntryDto: CreateFoodEntryDto): Promise<FoodEntry>;
    findAll(userId: string, date?: string, mealType?: string): Promise<{
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
    findOne(userId: string, entryId: string): Promise<FoodEntry>;
    update(userId: string, entryId: string, updateDto: UpdateFoodEntryDto): Promise<FoodEntry>;
    remove(userId: string, entryId: string): Promise<void>;
    getDailyTotals(userId: string, date: string): Promise<{
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        date: string;
        entries: number;
    }>;
    private serializeEntry;
}
