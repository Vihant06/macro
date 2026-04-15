import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FoodEntry, FoodEntryDocument } from './schemas/food-entry.schema';
import { CreateFoodEntryDto, UpdateFoodEntryDto } from './dto/create-food-entry.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(FoodEntry.name)
    private foodEntryModel: Model<FoodEntryDocument>,
  ) {}

  /**
   * Create a new food entry
   */
  async create(
    userId: string,
    createFoodEntryDto: CreateFoodEntryDto,
  ): Promise<FoodEntry> {
    const foodEntry = await this.foodEntryModel.create({
      ...createFoodEntryDto,
      userId,
      date: new Date(createFoodEntryDto.date),
    });

    return foodEntry;
  }

  /**
   * Get food entries for a user by date
   */
  async findAll(userId: string, date?: string, mealType?: string) {
    const query: any = { userId };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      query.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (mealType) {
      query.mealType = mealType;
    }

    const entries = await this.foodEntryModel.find(query).sort({ date: -1 }).exec();

    return entries.map((entry) => this.serializeEntry(entry));
  }

  /**
   * Get a single food entry by ID
   */
  async findOne(userId: string, entryId: string): Promise<FoodEntry> {
    const entry = await this.foodEntryModel
      .findOne({ _id: entryId, userId })
      .exec();

    if (!entry) {
      throw new NotFoundException('Food entry not found');
    }

    return entry;
  }

  /**
   * Update a food entry
   */
  async update(
    userId: string,
    entryId: string,
    updateDto: UpdateFoodEntryDto,
  ): Promise<FoodEntry> {
    const entry = await this.foodEntryModel
      .findOneAndUpdate(
        { _id: entryId, userId },
        updateDto,
        { new: true, runValidators: true },
      )
      .exec();

    if (!entry) {
      throw new NotFoundException('Food entry not found');
    }

    return entry;
  }

  /**
   * Delete a food entry
   */
  async remove(userId: string, entryId: string): Promise<void> {
    const result = await this.foodEntryModel.deleteOne({
      _id: entryId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Food entry not found');
    }
  }

  /**
   * Get daily totals for a user
   */
  async getDailyTotals(userId: string, date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const entries = await this.foodEntryModel
      .find({
        userId,
        date: {
          $gte: startDate,
          $lt: endDate,
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

    return {
      date,
      entries: entries.length,
      ...totals,
    };
  }

  private serializeEntry(entry: FoodEntryDocument) {
    return {
      id: entry._id,
      userId: entry.userId,
      date: entry.date,
      mealType: entry.mealType,
      foodName: entry.foodName,
      servingSize: entry.servingSize,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      recipeId: entry.recipeId,
    };
  }
}
