import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDailySummary(userId: string, date: string): Promise<{
        date: string;
        user: {
            name: string;
            goals: {
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
            };
        };
        nutrition: {
            totals: {
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
        };
        meals: Record<string, any[]>;
        entryCount: number;
        weight: {
            weight: number;
            bodyFatPercentage: number | undefined;
        } | null;
    }>;
    getWeeklyTrends(userId: string, endDate?: string): Promise<{
        startDate: string;
        endDate: string;
        dailyData: {
            date: string;
            calories: number;
            weight: number | null;
        }[];
        averages: {
            calories: number;
            weight: number | null;
        };
        weightChange: number | null;
    }>;
    getMacroDistribution(userId: string, startDate: string, endDate: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        totals: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        distribution: {
            protein: {
                calories: number;
                percentage: number;
            };
            carbs: {
                calories: number;
                percentage: number;
            };
            fat: {
                calories: number;
                percentage: number;
            };
        };
    }>;
    getProgressInsights(userId: string): Promise<{
        period: string;
        weight: {
            current: number | null;
            change: number | null;
            trend: string;
            dataPoints: number;
        };
        tracking: {
            daysTracked: number;
            adherenceRate: number;
            averageCalories: number | null;
        };
        goals: {
            calorieGoal: number;
            weightGoal: import("../users/dto/update-user.dto").Goal;
        };
        insights: {
            type: string;
            message: string;
        }[];
    }>;
}
