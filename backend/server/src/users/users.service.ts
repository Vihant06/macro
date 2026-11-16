import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto, ActivityLevel, Goal } from './dto/update-user.dto';
import { CalculateGoalsDto } from './dto/update-goals.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  /**
   * Find user by ID
   */
  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }

  /**
   * Create a new user (for OAuth and regular signup)
   */
  async create(createUserDto: any): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await this.findById(userId);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      bodyFat: user.bodyFat,
      activityLevel: user.activityLevel,
      goal: user.goal,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel
        .findOne({ email: updateUserDto.email.toLowerCase() })
        .exec();

      if (existingUser && existingUser._id.toString() !== userId) {
        throw new BadRequestException('Email already in use');
      }

      updateUserDto.email = updateUserDto.email.toLowerCase();
    }

    // Update user
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      gender: updatedUser.gender,
      height: updatedUser.height,
      weight: updatedUser.weight,
      activityLevel: updatedUser.activityLevel,
      goal: updatedUser.goal,
    };
  }

  /**
   * Get user goals
   */
  async getGoals(userId: string) {
    const user = await this.findById(userId);

    return {
      dailyCalories: user.dailyCalories,
      proteinGrams: user.proteinGrams,
      carbsGrams: user.carbsGrams,
      fatGrams: user.fatGrams,
    };
  }

  /**
   * Update user goals
   */
  async updateGoals(
    userId: string,
    goals: {
      dailyCalories?: number;
      proteinGrams?: number;
      carbsGrams?: number;
      fatGrams?: number;
    },
  ) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, goals, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      dailyCalories: updatedUser.dailyCalories,
      proteinGrams: updatedUser.proteinGrams,
      carbsGrams: updatedUser.carbsGrams,
      fatGrams: updatedUser.fatGrams,
    };
  }

  /**
   * Calculate macro goals based on user stats (Katch-McArdle Equation if bodyFat present, else Mifflin-St Jeor)
   */
  async calculateGoals(userId: string, calculateDto: CalculateGoalsDto) {
    const { age, weight, height, bodyFat, activityLevel, goal } = calculateDto;

    const user = await this.findById(userId);
    const isMale = user.gender !== 'female';

    let bmr: number;
    
    // Use Katch-McArdle Formula if body fat percentage is provided (more accurate)
    if (bodyFat !== undefined && bodyFat !== null && bodyFat > 0) {
      const leanBodyMass = weight * (1 - (bodyFat / 100));
      bmr = 370 + (21.6 * leanBodyMass);
    } else {
      // Fallback: Mifflin-St Jeor Equation
      if (isMale) {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
    }

    // Apply activity multiplier
    const activityMultipliers: Record<number, number> = {
      1: 1.2, // Sedentary / Poor
      2: 1.375, // Lightly active
      3: 1.55, // Moderately active
      4: 1.725, // Very active / Active
      5: 1.9, // Extremely active
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    // Apply goal adjustment
    // Fat loss -> TDEE - 500 kcal
    // Muscle gain -> TDEE + 300 kcal
    // Maintenance -> TDEE
    const goalAdjustments: Record<number, number> = {
      '-1': -500, // Weight loss
      '0': 0, // Maintain
      '1': 300, // Muscle gain
    };

    const dailyCalories = Math.round(tdee + (goalAdjustments[goal] || 0));

    // Calculate macros based on new formulas
    // Protein: 1.6 to 2.2 x body weight
    // Fat: 0.6 to 1.0 x body weight
    
    let proteinMultiplier = 1.8; // Default maintain
    if (goal === -1) proteinMultiplier = 2.2; // High protein if cutting
    else if (goal === 1) proteinMultiplier = 2.0; // High protein if bulking
    
    const fatMultiplier = 0.8; // Middle of the 0.6 - 1.0 range

    const proteinGrams = Math.round(proteinMultiplier * weight);
    const fatGrams = Math.round(fatMultiplier * weight);
    
    // Remaining calories for carbs
    // Carbs = (Total Calories - (Protein * 4 + Fat * 9)) / 4
    const remainingCalories = dailyCalories - (proteinGrams * 4 + fatGrams * 9);
    const carbsGrams = remainingCalories > 0 ? Math.round(remainingCalories / 4) : 0;

    // Update user goals
    await this.updateGoals(userId, {
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
    });

    // Update user stats if provided
    await this.updateProfile(userId, {
      age,
      weight,
      height,
      bodyFat,
      activityLevel: this.getActivityLevelEnum(activityLevel),
      goal: this.getGoalEnum(goal),
    });

    return {
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      tdee: Math.round(tdee),
      bmr: Math.round(bmr),
    };
  }

  private getActivityLevelEnum(level: number): ActivityLevel {
    const levels: Record<number, ActivityLevel> = {
      1: ActivityLevel.SEDENTARY,
      2: ActivityLevel.LIGHTLY_ACTIVE,
      3: ActivityLevel.MODERATELY_ACTIVE,
      4: ActivityLevel.VERY_ACTIVE,
      5: ActivityLevel.EXTREMELY_ACTIVE,
    };
    return levels[level] || ActivityLevel.SEDENTARY;
  }

  private getGoalEnum(goal: number): Goal {
    const goals: Record<number, Goal> = {
      '-1': Goal.LOSE_WEIGHT,
      '0': Goal.MAINTAIN,
      '1': Goal.GAIN_MUSCLE,
    };
    return goals[goal] || Goal.MAINTAIN;
  }

  /**
   * Increment AI Usage for a user
   */
  async incrementAiUsage(userId: string): Promise<void> {
    const user = await this.findById(userId);
    const now = new Date();
    
    // Reset if it's a new day (UTC-based simple check)
    if (
      !user.lastAiRequestDate || 
      user.lastAiRequestDate.getUTCFullYear() !== now.getUTCFullYear() ||
      user.lastAiRequestDate.getUTCMonth() !== now.getUTCMonth() ||
      user.lastAiRequestDate.getUTCDate() !== now.getUTCDate()
    ) {
      user.aiRequestCount = 1;
    } else {
      user.aiRequestCount = (user.aiRequestCount || 0) + 1;
    }
    
    user.lastAiRequestDate = now;
    await user.save();
  }

  /**
   * Check AI Usage limit
   */
  async checkAiUsage(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    const now = new Date();

    if (
      !user.lastAiRequestDate || 
      user.lastAiRequestDate.getUTCFullYear() !== now.getUTCFullYear() ||
      user.lastAiRequestDate.getUTCMonth() !== now.getUTCMonth() ||
      user.lastAiRequestDate.getUTCDate() !== now.getUTCDate()
    ) {
      return true; // New day, limit reset
    }
    
    return (user.aiRequestCount || 0) < 50;
  }
}
