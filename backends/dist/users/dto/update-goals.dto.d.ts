export declare class UpdateGoalsDto {
    dailyCalories?: number;
    proteinGrams?: number;
    carbsGrams?: number;
    fatGrams?: number;
}
export declare class CalculateGoalsDto {
    age: number;
    weight: number;
    height: number;
    bodyFat?: number;
    activityLevel: number;
    goal: number;
}
