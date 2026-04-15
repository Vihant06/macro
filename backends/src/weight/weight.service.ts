import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeightLog, WeightLogDocument } from './schemas/weight-log.schema';
import { CreateWeightLogDto } from './dto/create-weight-log.dto';

@Injectable()
export class WeightService {
  constructor(
    @InjectModel(WeightLog.name)
    private weightLogModel: Model<WeightLogDocument>,
  ) {}

  /**
   * Create a new weight log entry
   */
  async create(
    userId: string,
    createWeightLogDto: CreateWeightLogDto,
  ): Promise<WeightLog> {
    const date = createWeightLogDto.date
      ? new Date(createWeightLogDto.date)
      : new Date();

    // Check if entry already exists for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const existingEntry = await this.weightLogModel
      .findOne({
        userId,
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      })
      .exec();

    if (existingEntry) {
      // Update existing entry instead of creating duplicate
      const updated = await this.weightLogModel
        .findByIdAndUpdate(
          existingEntry._id,
          {
            weight: createWeightLogDto.weight,
            bodyFatPercentage: createWeightLogDto.bodyFatPercentage,
            notes: createWeightLogDto.notes,
          },
          { new: true },
        )
        .exec();

      return updated!;
    }

    const weightLog = await this.weightLogModel.create({
      userId,
      date,
      weight: createWeightLogDto.weight,
      bodyFatPercentage: createWeightLogDto.bodyFatPercentage,
      notes: createWeightLogDto.notes,
    });

    return weightLog;
  }

  /**
   * Get weight logs with optional date range
   */
  async findAll(userId: string, options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    const query: any = { userId };

    if (options?.startDate) {
      query.date = { ...query.date, $gte: new Date(options.startDate) };
    }

    if (options?.endDate) {
      const endDate = new Date(options.endDate);
      endDate.setDate(endDate.getDate() + 1); // Include the end date
      query.date = { ...query.date, $lt: endDate };
    }

    const logs = await this.weightLogModel
      .find(query)
      .sort({ date: -1 })
      .limit(options?.limit || 100)
      .exec();

    return logs.map((log) => this.serializeLog(log));
  }

  /**
   * Get weight log by ID
   */
  async findOne(userId: string, logId: string): Promise<WeightLog> {
    const log = await this.weightLogModel
      .findOne({ _id: logId, userId })
      .exec();

    if (!log) {
      throw new NotFoundException('Weight log not found');
    }

    return log;
  }

  /**
   * Update a weight log
   */
  async update(
    userId: string,
    logId: string,
    updateData: Partial<CreateWeightLogDto>,
  ): Promise<WeightLog> {
    const log = await this.weightLogModel
      .findOneAndUpdate(
        { _id: logId, userId },
        updateData,
        { new: true, runValidators: true },
      )
      .exec();

    if (!log) {
      throw new NotFoundException('Weight log not found');
    }

    return log;
  }

  /**
   * Delete a weight log
   */
  async remove(userId: string, logId: string): Promise<void> {
    const result = await this.weightLogModel.deleteOne({
      _id: logId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Weight log not found');
    }
  }

  /**
   * Get weight trend analysis
   */
  async getTrendAnalysis(userId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.weightLogModel
      .find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: 1 })
      .exec();

    if (logs.length === 0) {
      return {
        period: `${days} days`,
        dataPoints: 0,
        currentWeight: null,
        startingWeight: null,
        change: null,
        percentChange: null,
        averageWeight: null,
        trend: 'insufficient_data',
      };
    }

    const weights = logs.map((log) => log.weight);
    const currentWeight = weights[weights.length - 1];
    const startingWeight = weights[0];
    const change = currentWeight - startingWeight;
    const percentChange = startingWeight > 0 ? (change / startingWeight) * 100 : 0;
    const averageWeight = weights.reduce((a, b) => a + b, 0) / weights.length;

    // Calculate trend direction
    let trend = 'stable';
    if (change < -0.5) trend = 'losing';
    else if (change > 0.5) trend = 'gaining';

    // Calculate 7-day and 30-day averages
    const last7Days = weights.slice(-7);
    const last30Days = weights.slice(-30);

    return {
      period: `${days} days`,
      dataPoints: logs.length,
      currentWeight,
      startingWeight,
      change: Math.round(change * 100) / 100,
      percentChange: Math.round(percentChange * 100) / 100,
      averageWeight: Math.round(averageWeight * 100) / 100,
      sevenDayAverage: Math.round((last7Days.reduce((a, b) => a + b, 0) / last7Days.length) * 100) / 100,
      thirtyDayAverage: last30Days.length > 0
        ? Math.round((last30Days.reduce((a, b) => a + b, 0) / last30Days.length) * 100) / 100
        : null,
      trend,
      history: logs.map((log) => ({
        date: log.date.toISOString().split('T')[0],
        weight: log.weight,
      })),
    };
  }

  private serializeLog(log: WeightLogDocument) {
    return {
      id: log._id,
      userId: log.userId,
      date: log.date.toISOString().split('T')[0],
      weight: log.weight,
      bodyFatPercentage: log.bodyFatPercentage,
      notes: log.notes,
    };
  }
}
