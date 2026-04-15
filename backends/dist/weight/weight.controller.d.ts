import { WeightService } from './weight.service';
import { CreateWeightLogDto, GetWeightLogsDto } from './dto/create-weight-log.dto';
export declare class WeightController {
    private weightService;
    constructor(weightService: WeightService);
    create(userId: string, createWeightLogDto: CreateWeightLogDto): Promise<import("./schemas/weight-log.schema").WeightLog>;
    findAll(userId: string, query: GetWeightLogsDto): Promise<{
        id: any;
        userId: string;
        date: string;
        weight: number;
        bodyFatPercentage: number | undefined;
        notes: string | undefined;
    }[]>;
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
    findOne(userId: string, id: string): Promise<import("./schemas/weight-log.schema").WeightLog>;
    update(userId: string, id: string, updateData: Partial<CreateWeightLogDto>): Promise<import("./schemas/weight-log.schema").WeightLog>;
    remove(userId: string, id: string): Promise<void>;
}
