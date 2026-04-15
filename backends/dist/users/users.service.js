"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const update_user_dto_1 = require("./dto/update-user.dto");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
    }
    async create(createUserDto) {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }
    async getProfile(userId) {
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
    async updateProfile(userId, updateUserDto) {
        const user = await this.findById(userId);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userModel
                .findOne({ email: updateUserDto.email.toLowerCase() })
                .exec();
            if (existingUser && existingUser._id.toString() !== userId) {
                throw new common_1.BadRequestException('Email already in use');
            }
            updateUserDto.email = updateUserDto.email.toLowerCase();
        }
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, updateUserDto, {
            new: true,
            runValidators: true,
        })
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
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
    async getGoals(userId) {
        const user = await this.findById(userId);
        return {
            dailyCalories: user.dailyCalories,
            proteinGrams: user.proteinGrams,
            carbsGrams: user.carbsGrams,
            fatGrams: user.fatGrams,
        };
    }
    async updateGoals(userId, goals) {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, goals, {
            new: true,
            runValidators: true,
        })
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            dailyCalories: updatedUser.dailyCalories,
            proteinGrams: updatedUser.proteinGrams,
            carbsGrams: updatedUser.carbsGrams,
            fatGrams: updatedUser.fatGrams,
        };
    }
    async calculateGoals(userId, calculateDto) {
        const { age, weight, height, bodyFat, activityLevel, goal } = calculateDto;
        const user = await this.findById(userId);
        const isMale = user.gender !== 'female';
        let bmr;
        if (bodyFat !== undefined && bodyFat !== null && bodyFat > 0) {
            const leanBodyMass = weight * (1 - (bodyFat / 100));
            bmr = 370 + (21.6 * leanBodyMass);
        }
        else {
            if (isMale) {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            }
            else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
        }
        const activityMultipliers = {
            1: 1.2,
            2: 1.375,
            3: 1.55,
            4: 1.725,
            5: 1.9,
        };
        const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
        const goalAdjustments = {
            '-1': -500,
            '0': 0,
            '1': 300,
        };
        const dailyCalories = Math.round(tdee + (goalAdjustments[goal] || 0));
        let proteinMultiplier = 1.8;
        if (goal === -1)
            proteinMultiplier = 2.2;
        else if (goal === 1)
            proteinMultiplier = 2.0;
        const fatMultiplier = 0.8;
        const proteinGrams = Math.round(proteinMultiplier * weight);
        const fatGrams = Math.round(fatMultiplier * weight);
        const remainingCalories = dailyCalories - (proteinGrams * 4 + fatGrams * 9);
        const carbsGrams = remainingCalories > 0 ? Math.round(remainingCalories / 4) : 0;
        await this.updateGoals(userId, {
            dailyCalories,
            proteinGrams,
            carbsGrams,
            fatGrams,
        });
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
    getActivityLevelEnum(level) {
        const levels = {
            1: update_user_dto_1.ActivityLevel.SEDENTARY,
            2: update_user_dto_1.ActivityLevel.LIGHTLY_ACTIVE,
            3: update_user_dto_1.ActivityLevel.MODERATELY_ACTIVE,
            4: update_user_dto_1.ActivityLevel.VERY_ACTIVE,
            5: update_user_dto_1.ActivityLevel.EXTREMELY_ACTIVE,
        };
        return levels[level] || update_user_dto_1.ActivityLevel.SEDENTARY;
    }
    getGoalEnum(goal) {
        const goals = {
            '-1': update_user_dto_1.Goal.LOSE_WEIGHT,
            '0': update_user_dto_1.Goal.MAINTAIN,
            '1': update_user_dto_1.Goal.GAIN_MUSCLE,
        };
        return goals[goal] || update_user_dto_1.Goal.MAINTAIN;
    }
    async incrementAiUsage(userId) {
        const user = await this.findById(userId);
        const now = new Date();
        if (!user.lastAiRequestDate ||
            user.lastAiRequestDate.getUTCFullYear() !== now.getUTCFullYear() ||
            user.lastAiRequestDate.getUTCMonth() !== now.getUTCMonth() ||
            user.lastAiRequestDate.getUTCDate() !== now.getUTCDate()) {
            user.aiRequestCount = 1;
        }
        else {
            user.aiRequestCount = (user.aiRequestCount || 0) + 1;
        }
        user.lastAiRequestDate = now;
        await user.save();
    }
    async checkAiUsage(userId) {
        const user = await this.findById(userId);
        const now = new Date();
        if (!user.lastAiRequestDate ||
            user.lastAiRequestDate.getUTCFullYear() !== now.getUTCFullYear() ||
            user.lastAiRequestDate.getUTCMonth() !== now.getUTCMonth() ||
            user.lastAiRequestDate.getUTCDate() !== now.getUTCDate()) {
            return true;
        }
        return (user.aiRequestCount || 0) < 50;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map