"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const food_entry_schema_1 = require("../food/schemas/food-entry.schema");
const weight_log_schema_1 = require("../weight/schemas/weight-log.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let AnalyticsService = class AnalyticsService {
    foodEntryModel;
    weightLogModel;
    userModel;
    constructor(foodEntryModel, weightLogModel, userModel) {
        this.foodEntryModel = foodEntryModel;
        this.weightLogModel = weightLogModel;
        this.userModel = userModel;
    }
    async getDailySummary(userId, date) {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        const foodEntries = await this.foodEntryModel
            .find({
            userId,
            date: {
                $gte: targetDate,
                $lt: nextDay,
            },
        })
            .exec();
        const macroTotals = foodEntries.reduce((acc, entry) => ({
            calories: acc.calories + entry.calories,
            protein: acc.protein + entry.protein,
            carbs: acc.carbs + entry.carbs,
            fat: acc.fat + entry.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
        const weightLog = await this.weightLogModel
            .findOne({
            userId,
            date: {
                $gte: targetDate,
                $lt: nextDay,
            },
        })
            .exec();
        const mealsByType = foodEntries.reduce((acc, entry) => {
            if (!acc[entry.mealType]) {
                acc[entry.mealType] = [];
            }
            acc[entry.mealType].push({
                id: entry._id,
                foodName: entry.foodName,
                calories: entry.calories,
                protein: entry.protein,
                carbs: entry.carbs,
                fat: entry.fat,
            });
            return acc;
        }, {});
        return {
            date,
            user: {
                name: user.name,
                goals: {
                    calories: user.dailyCalories,
                    protein: user.proteinGrams,
                    carbs: user.carbsGrams,
                    fat: user.fatGrams,
                },
            },
            nutrition: {
                totals: macroTotals,
                remaining: {
                    calories: user.dailyCalories - macroTotals.calories,
                    protein: user.proteinGrams - macroTotals.protein,
                    carbs: user.carbsGrams - macroTotals.carbs,
                    fat: user.fatGrams - macroTotals.fat,
                },
                percentComplete: {
                    calories: Math.round((macroTotals.calories / user.dailyCalories) * 100),
                    protein: Math.round((macroTotals.protein / user.proteinGrams) * 100),
                    carbs: Math.round((macroTotals.carbs / user.carbsGrams) * 100),
                    fat: Math.round((macroTotals.fat / user.fatGrams) * 100),
                },
            },
            meals: mealsByType,
            entryCount: foodEntries.length,
            weight: weightLog
                ? {
                    weight: weightLog.weight,
                    bodyFatPercentage: weightLog.bodyFatPercentage,
                }
                : null,
        };
    }
    async getWeeklyTrends(userId, endDate = new Date()) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        const weightLogs = await this.weightLogModel
            .find({
            userId,
            date: { $gte: start, $lte: end },
        })
            .sort({ date: 1 })
            .exec();
        const foodEntries = await this.foodEntryModel
            .find({
            userId,
            date: { $gte: start, $lte: end },
        })
            .exec();
        const dailyCalories = {};
        for (const entry of foodEntries) {
            const dateStr = entry.date.toISOString().split('T')[0];
            dailyCalories[dateStr] = (dailyCalories[dateStr] || 0) + entry.calories;
        }
        const trendData = [];
        const current = new Date(start);
        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            const weightEntry = weightLogs.find((w) => w.date.toISOString().split('T')[0] === dateStr);
            trendData.push({
                date: dateStr,
                calories: dailyCalories[dateStr] || 0,
                weight: weightEntry ? weightEntry.weight : null,
            });
            current.setDate(current.getDate() + 1);
        }
        const daysWithData = trendData.filter((d) => d.calories > 0).length;
        const avgCalories = daysWithData > 0
            ? Math.round(trendData.reduce((sum, d) => sum + d.calories, 0) / daysWithData)
            : 0;
        const weightValues = weightLogs.map((w) => w.weight);
        const avgWeight = weightValues.length > 0
            ? Math.round((weightValues.reduce((sum, w) => sum + w, 0) / weightValues.length) *
                100) / 100
            : null;
        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            dailyData: trendData,
            averages: {
                calories: avgCalories,
                weight: avgWeight,
            },
            weightChange: weightLogs.length >= 2
                ? Math.round((weightLogs[weightLogs.length - 1].weight - weightLogs[0].weight) *
                    100) / 100
                : null,
        };
    }
    async getMacroDistribution(userId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const entries = await this.foodEntryModel
            .find({
            userId,
            date: { $gte: start, $lte: end },
        })
            .exec();
        const totals = entries.reduce((acc, entry) => ({
            calories: acc.calories + entry.calories,
            protein: acc.protein + entry.protein,
            carbs: acc.carbs + entry.carbs,
            fat: acc.fat + entry.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
        const proteinCalories = totals.protein * 4;
        const carbsCalories = totals.carbs * 4;
        const fatCalories = totals.fat * 9;
        const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;
        return {
            period: { startDate, endDate },
            totals: {
                calories: totals.calories,
                protein: totals.protein,
                carbs: totals.carbs,
                fat: totals.fat,
            },
            distribution: {
                protein: {
                    calories: proteinCalories,
                    percentage: totalMacroCalories > 0
                        ? Math.round((proteinCalories / totalMacroCalories) * 100)
                        : 0,
                },
                carbs: {
                    calories: carbsCalories,
                    percentage: totalMacroCalories > 0
                        ? Math.round((carbsCalories / totalMacroCalories) * 100)
                        : 0,
                },
                fat: {
                    calories: fatCalories,
                    percentage: totalMacroCalories > 0
                        ? Math.round((fatCalories / totalMacroCalories) * 100)
                        : 0,
                },
            },
        };
    }
    async getProgressInsights(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const weightLogs = await this.weightLogModel
            .find({
            userId,
            date: { $gte: startDate, $lte: endDate },
        })
            .sort({ date: 1 })
            .exec();
        let weightChange = null;
        let weightTrend = 'stable';
        if (weightLogs.length >= 2) {
            weightChange = Math.round((weightLogs[weightLogs.length - 1].weight - weightLogs[0].weight) * 100) / 100;
            if (weightChange < -0.5)
                weightTrend = 'losing';
            else if (weightChange > 0.5)
                weightTrend = 'gaining';
        }
        const foodEntries = await this.foodEntryModel
            .find({
            userId,
            date: { $gte: startDate, $lte: endDate },
        })
            .exec();
        const dailyCalories = {};
        for (const entry of foodEntries) {
            const dateStr = entry.date.toISOString().split('T')[0];
            dailyCalories[dateStr] = (dailyCalories[dateStr] || 0) + entry.calories;
        }
        const daysTracked = Object.keys(dailyCalories).length;
        const daysWithinGoal = Object.values(dailyCalories).filter((cal) => cal >= user.dailyCalories * 0.9 && cal <= user.dailyCalories * 1.1).length;
        const adherenceRate = daysTracked > 0
            ? Math.round((daysWithinGoal / daysTracked) * 100)
            : 0;
        const insights = [];
        if (weightTrend === 'losing' && user.goal === 'lose_weight') {
            insights.push({
                type: 'positive',
                message: "Great job! You're on track with your weight loss goal.",
            });
        }
        else if (weightTrend === 'gaining' && user.goal === 'gain_muscle') {
            insights.push({
                type: 'positive',
                message: "Good progress! You're gaining weight as expected for muscle gain.",
            });
        }
        else if (weightTrend === 'stable' && user.goal === 'lose_weight') {
            insights.push({
                type: 'warning',
                message: 'Your weight is stable. Consider reducing calories or increasing activity.',
            });
        }
        if (adherenceRate >= 80) {
            insights.push({
                type: 'positive',
                message: `Excellent adherence! You've stayed within your calorie goal ${adherenceRate}% of the time.`,
            });
        }
        else if (adherenceRate >= 50) {
            insights.push({
                type: 'neutral',
                message: `You're tracking consistently. Try to hit your calorie target more often.`,
            });
        }
        else {
            insights.push({
                type: 'info',
                message: 'Start tracking more consistently to see better insights.',
            });
        }
        return {
            period: 'Last 30 days',
            weight: {
                current: weightLogs.length > 0
                    ? weightLogs[weightLogs.length - 1].weight
                    : null,
                change: weightChange,
                trend: weightTrend,
                dataPoints: weightLogs.length,
            },
            tracking: {
                daysTracked,
                adherenceRate,
                averageCalories: daysTracked > 0
                    ? Math.round(Object.values(dailyCalories).reduce((a, b) => a + b, 0) /
                        daysTracked)
                    : null,
            },
            goals: {
                calorieGoal: user.dailyCalories,
                weightGoal: user.goal,
            },
            insights,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(food_entry_schema_1.FoodEntry.name)),
    __param(1, (0, mongoose_1.InjectModel)(weight_log_schema_1.WeightLog.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map