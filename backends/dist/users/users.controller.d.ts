import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CalculateGoalsDto } from './dto/update-goals.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<{
        id: any;
        name: string;
        email: string;
        age: number | undefined;
        gender: import("./dto/update-user.dto").Gender | undefined;
        height: number | undefined;
        weight: number | undefined;
        bodyFat: number | undefined;
        activityLevel: import("./dto/update-user.dto").ActivityLevel;
        goal: import("./dto/update-user.dto").Goal;
    }>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<{
        id: any;
        name: string;
        email: string;
        age: number | undefined;
        gender: import("./dto/update-user.dto").Gender | undefined;
        height: number | undefined;
        weight: number | undefined;
        activityLevel: import("./dto/update-user.dto").ActivityLevel;
        goal: import("./dto/update-user.dto").Goal;
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
}
