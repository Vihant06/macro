import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { UpdateUserDto, ActivityLevel, Goal } from './dto/update-user.dto';
import { CalculateGoalsDto } from './dto/update-goals.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findById(userId: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    create(createUserDto: any): Promise<UserDocument>;
    getProfile(userId: string): Promise<{
        id: any;
        name: string;
        email: string;
        age: number | undefined;
        gender: import("./dto/update-user.dto").Gender | undefined;
        height: number | undefined;
        weight: number | undefined;
        bodyFat: number | undefined;
        activityLevel: ActivityLevel;
        goal: Goal;
    }>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<{
        id: any;
        name: string;
        email: string;
        age: number | undefined;
        gender: import("./dto/update-user.dto").Gender | undefined;
        height: number | undefined;
        weight: number | undefined;
        activityLevel: ActivityLevel;
        goal: Goal;
    }>;
    getGoals(userId: string): Promise<{
        dailyCalories: number;
        proteinGrams: number;
        carbsGrams: number;
        fatGrams: number;
    }>;
    updateGoals(userId: string, goals: {
        dailyCalories?: number;
        proteinGrams?: number;
        carbsGrams?: number;
        fatGrams?: number;
    }): Promise<{
        dailyCalories: number;
        proteinGrams: number;
        carbsGrams: number;
        fatGrams: number;
    }>;
    calculateGoals(userId: string, calculateDto: CalculateGoalsDto): Promise<{
        dailyCalories: number;
        proteinGrams: number;
        carbsGrams: number;
        fatGrams: number;
        tdee: number;
        bmr: number;
    }>;
    private getActivityLevelEnum;
    private getGoalEnum;
    incrementAiUsage(userId: string): Promise<void>;
    checkAiUsage(userId: string): Promise<boolean>;
}
