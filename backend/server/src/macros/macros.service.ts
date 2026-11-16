import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FoodEntry } from '../food/schemas/food-entry.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class MacrosService {
  constructor(
    @InjectModel(FoodEntry.name)
    private foodEntryModel: Model<FoodEntry>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  /**
   * Get today's macro totals and remaining
   */
  async getTodayTotals(userId: string, targetDateStr?: string) {
    const today = targetDateStr ? new Date(targetDateStr) : new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get user goals
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Get today's entries
    const entries = await this.foodEntryModel
      .find({
        userId,
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .exec();

    // Calculate totals
    const totals = entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    // Calculate remaining
    const remaining = {
      calories: user.dailyCalories - totals.calories,
      protein: user.proteinGrams - totals.protein,
      carbs: user.carbsGrams - totals.carbs,
      fat: user.fatGrams - totals.fat,
    };

    return {
      date: today.toISOString().split('T')[0],
      goals: {
        calories: user.dailyCalories,
        protein: user.proteinGrams,
        carbs: user.carbsGrams,
        fat: user.fatGrams,
      },
      consumed: totals,
      remaining,
      percentComplete: {
        calories: Math.round((totals.calories / user.dailyCalories) * 100),
        protein: Math.round((totals.protein / user.proteinGrams) * 100),
        carbs: Math.round((totals.carbs / user.carbsGrams) * 100),
        fat: Math.round((totals.fat / user.fatGrams) * 100),
      },
    };
  }

  /**
   * Get weekly macro summary
   */
  async getWeeklySummary(userId: string, endDate: Date = new Date()) {
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 6); // 7 days including end date

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Get entries for the week
    const entries = await this.foodEntryModel
      .find({
        userId,
        date: {
          $gte: start,
          $lte: end,
        },
      })
      .exec();

    // Group by date
    const dailyTotals = this.groupByDate(entries);

    // Calculate averages
    const daysWithData = Object.keys(dailyTotals).length;
    const weeklyTotals = Object.values(dailyTotals).reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const dailyAverages = {
      calories: daysWithData > 0 ? Math.round(weeklyTotals.calories / daysWithData) : 0,
      protein: daysWithData > 0 ? Math.round(weeklyTotals.protein / daysWithData) : 0,
      carbs: daysWithData > 0 ? Math.round(weeklyTotals.carbs / daysWithData) : 0,
      fat: daysWithData > 0 ? Math.round(weeklyTotals.fat / daysWithData) : 0,
    };

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      daysTracked: daysWithData,
      weeklyTotals,
      dailyAverages,
      goals: {
        calories: user.dailyCalories,
        protein: user.proteinGrams,
        carbs: user.carbsGrams,
        fat: user.fatGrams,
      },
      weeklyGoalTotals: {
        calories: user.dailyCalories * 7,
        protein: user.proteinGrams * 7,
        carbs: user.carbsGrams * 7,
        fat: user.fatGrams * 7,
      },
    };
  }

  /**
   * Get macro distribution (percentage of calories from each macro)
   */
  async getMacroDistribution(userId: string, date: Date = new Date()) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const entries = await this.foodEntryModel
      .find({
        userId,
        date: {
          $gte: targetDate,
          $lt: nextDay,
        },
      })
      .exec();

    const totals = entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    // Calculate calories from each macro
    const proteinCalories = totals.protein * 4;
    const carbsCalories = totals.carbs * 4;
    const fatCalories = totals.fat * 9;

    const totalCalories = proteinCalories + carbsCalories + fatCalories;

    return {
      date: targetDate.toISOString().split('T')[0],
      totalCalories: totals.calories,
      distribution: {
        protein: {
          grams: totals.protein,
          calories: proteinCalories,
          percentage: totalCalories > 0 ? Math.round((proteinCalories / totalCalories) * 100) : 0,
        },
        carbs: {
          grams: totals.carbs,
          calories: carbsCalories,
          percentage: totalCalories > 0 ? Math.round((carbsCalories / totalCalories) * 100) : 0,
        },
        fat: {
          grams: totals.fat,
          calories: fatCalories,
          percentage: totalCalories > 0 ? Math.round((fatCalories / totalCalories) * 100) : 0,
        },
      },
    };
  }

  /**
   * Get monthly trend data
   */
  async getMonthlyTrend(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    const entries = await this.foodEntryModel
      .find({
        userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Group by date
    const dailyData = this.groupByDate(entries);

    // Create array for all days in month
    const daysInMonth = endDate.getDate();
    const trendData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month - 1, day).toISOString().split('T')[0];
      const dayData = dailyData[dateStr] || { calories: 0, protein: 0, carbs: 0, fat: 0 };

      trendData.push({
        date: dateStr,
        ...dayData,
        remaining: {
          calories: user.dailyCalories - dayData.calories,
          protein: user.proteinGrams - dayData.protein,
          carbs: user.carbsGrams - dayData.carbs,
          fat: user.fatGrams - dayData.fat,
        },
      });
    }

    return {
      month,
      year,
      dailyData: trendData,
      monthlyAverage: this.calculateMonthlyAverage(trendData),
    };
  }

  private groupByDate(entries: FoodEntry[]): Record<string, any> {
    const grouped: Record<string, any> = {};

    for (const entry of entries) {
      const dateStr = entry.date.toISOString().split('T')[0];

      if (!grouped[dateStr]) {
        grouped[dateStr] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }

      grouped[dateStr].calories += entry.calories;
      grouped[dateStr].protein += entry.protein;
      grouped[dateStr].carbs += entry.carbs;
      grouped[dateStr].fat += entry.fat;
    }

    return grouped;
  }

  private calculateMonthlyAverage(dailyData: any[]) {
    const daysWithData = dailyData.filter((d) => d.calories > 0).length;

    if (daysWithData === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    const totals = dailyData.reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    return {
      calories: Math.round(totals.calories / daysWithData),
      protein: Math.round(totals.protein / daysWithData),
      carbs: Math.round(totals.carbs / daysWithData),
      fat: Math.round(totals.fat / daysWithData),
    };
  }
}
