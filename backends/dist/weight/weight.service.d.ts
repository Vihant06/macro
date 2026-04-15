import { Model } from 'mongoose';
import { WeightLog, WeightLogDocument } from './schemas/weight-log.schema';
import { CreateWeightLogDto } from './dto/create-weight-log.dto';
export declare class WeightService {
    private weightLogModel;
    constructor(weightLogModel: Model<WeightLogDocument>);
    create(userId: string, createWeightLogDto: CreateWeightLogDto): Promise<WeightLog>;
    findAll(userId: string, options?: {
        startDate?: string;
        endDate?: string;
        limit?: number;
    }): Promise<{
        id: any;
        userId: string;
        date: string;
        weight: number;
        bodyFatPercentage: number | undefined;
        notes: string | undefined;
    }[]>;
    findOne(userId: string, logId: string): Promise<WeightLog>;
    update(userId: string, logId: string, updateData: Partial<CreateWeightLogDto>): Promise<WeightLog>;
    remove(userId: string, logId: string): Promise<void>;
    getTrendAnalysis(userId: string, days?: number): Promise<{
        period: string;
        dataPoints: number;
        currentWeight: null;
        startingWeight: null;
        change: null;
        percentChange: null;
        averageWeight: null;
        trend: string;
        sevenDayAverage?: undefined;
        thirtyDayAverage?: undefined;
        history?: undefined;
    } | {
        period: string;
        dataPoints: number;
        currentWeight: number;
        startingWeight: number;
        change: number;
        percentChange: number;
        averageWeight: number;
        sevenDayAverage: number;
        thirtyDayAverage: number | null;
        trend: string;
        history: {
            date: string;
            weight: number;
        }[];
    }>;
    private serializeLog;
}
