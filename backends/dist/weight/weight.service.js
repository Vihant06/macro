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
exports.WeightService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const weight_log_schema_1 = require("./schemas/weight-log.schema");
let WeightService = class WeightService {
    weightLogModel;
    constructor(weightLogModel) {
        this.weightLogModel = weightLogModel;
    }
    async create(userId, createWeightLogDto) {
        const date = createWeightLogDto.date
            ? new Date(createWeightLogDto.date)
            : new Date();
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
            const updated = await this.weightLogModel
                .findByIdAndUpdate(existingEntry._id, {
                weight: createWeightLogDto.weight,
                bodyFatPercentage: createWeightLogDto.bodyFatPercentage,
                notes: createWeightLogDto.notes,
            }, { new: true })
                .exec();
            return updated;
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
    async findAll(userId, options) {
        const query = { userId };
        if (options?.startDate) {
            query.date = { ...query.date, $gte: new Date(options.startDate) };
        }
        if (options?.endDate) {
            const endDate = new Date(options.endDate);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { ...query.date, $lt: endDate };
        }
        const logs = await this.weightLogModel
            .find(query)
            .sort({ date: -1 })
            .limit(options?.limit || 100)
            .exec();
        return logs.map((log) => this.serializeLog(log));
    }
    async findOne(userId, logId) {
        const log = await this.weightLogModel
            .findOne({ _id: logId, userId })
            .exec();
        if (!log) {
            throw new common_1.NotFoundException('Weight log not found');
        }
        return log;
    }
    async update(userId, logId, updateData) {
        const log = await this.weightLogModel
            .findOneAndUpdate({ _id: logId, userId }, updateData, { new: true, runValidators: true })
            .exec();
        if (!log) {
            throw new common_1.NotFoundException('Weight log not found');
        }
        return log;
    }
    async remove(userId, logId) {
        const result = await this.weightLogModel.deleteOne({
            _id: logId,
            userId,
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Weight log not found');
        }
    }
    async getTrendAnalysis(userId, days = 30) {
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
        let trend = 'stable';
        if (change < -0.5)
            trend = 'losing';
        else if (change > 0.5)
            trend = 'gaining';
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
    serializeLog(log) {
        return {
            id: log._id,
            userId: log.userId,
            date: log.date.toISOString().split('T')[0],
            weight: log.weight,
            bodyFatPercentage: log.bodyFatPercentage,
            notes: log.notes,
        };
    }
};
exports.WeightService = WeightService;
exports.WeightService = WeightService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(weight_log_schema_1.WeightLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WeightService);
//# sourceMappingURL=weight.service.js.map