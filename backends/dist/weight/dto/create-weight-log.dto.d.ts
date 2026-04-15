export declare class CreateWeightLogDto {
    weight: number;
    date?: string;
    bodyFatPercentage?: number;
    notes?: string;
}
export declare class GetWeightLogsDto {
    startDate?: string;
    endDate?: string;
    limit?: number;
}
