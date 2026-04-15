import { Model } from 'mongoose';
import { FoodEntry } from '../food/schemas/food-entry.schema';
import { User } from '../users/schemas/user.schema';
export declare class MacrosService {
    private foodEntryModel;
    private userModel;
    constructor(foodEntryModel: Model<FoodEntry>, userModel: Model<User>);
    getTodayTotals(userId: string, targetDateStr?: string): Promise<{
        date: string;
        goals: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        consumed: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        remaining: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        percentComplete: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
    }>;
    getWeeklySummary(userId: string, endDate?: Date): Promise<{
        startDate: string;
        endDate: string;
        daysTracked: number;
        weeklyTotals: any;
        dailyAverages: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        goals: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        weeklyGoalTotals: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
    }>;
    getMacroDistribution(userId: string, date?: Date): Promise<{
        date: string;
        totalCalories: number;
        distribution: {
            protein: {
                grams: number;
                calories: number;
                percentage: number;
            };
            carbs: {
                grams: number;
                calories: number;
                percentage: number;
            };
            fat: {
                grams: number;
                calories: number;
                percentage: number;
            };
        };
    }>;
    getMonthlyTrend(userId: string, month: number, year: number): Promise<{
        month: number;
        year: number;
        dailyData: any[];
        monthlyAverage: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
    }>;
    private groupByDate;
    private calculateMonthlyAverage;
}
