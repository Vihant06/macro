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
exports.FoodService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const food_entry_schema_1 = require("./schemas/food-entry.schema");
let FoodService = class FoodService {
    foodEntryModel;
    constructor(foodEntryModel) {
        this.foodEntryModel = foodEntryModel;
    }
    async create(userId, createFoodEntryDto) {
        const foodEntry = await this.foodEntryModel.create({
            ...createFoodEntryDto,
            userId,
            date: new Date(createFoodEntryDto.date),
        });
        return foodEntry;
    }
    async findAll(userId, date, mealType) {
        const query = { userId };
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
    async findOne(userId, entryId) {
        const entry = await this.foodEntryModel
            .findOne({ _id: entryId, userId })
            .exec();
        if (!entry) {
            throw new common_1.NotFoundException('Food entry not found');
        }
        return entry;
    }
    async update(userId, entryId, updateDto) {
        const entry = await this.foodEntryModel
            .findOneAndUpdate({ _id: entryId, userId }, updateDto, { new: true, runValidators: true })
            .exec();
        if (!entry) {
            throw new common_1.NotFoundException('Food entry not found');
        }
        return entry;
    }
    async remove(userId, entryId) {
        const result = await this.foodEntryModel.deleteOne({
            _id: entryId,
            userId,
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Food entry not found');
        }
    }
    async getDailyTotals(userId, date) {
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
        const totals = entries.reduce((acc, entry) => ({
            calories: acc.calories + entry.calories,
            protein: acc.protein + entry.protein,
            carbs: acc.carbs + entry.carbs,
            fat: acc.fat + entry.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
        return {
            date,
            entries: entries.length,
            ...totals,
        };
    }
    serializeEntry(entry) {
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
};
exports.FoodService = FoodService;
exports.FoodService = FoodService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(food_entry_schema_1.FoodEntry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FoodService);
//# sourceMappingURL=food.service.js.map