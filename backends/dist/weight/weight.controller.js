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
exports.WeightController = void 0;
const common_1 = require("@nestjs/common");
const weight_service_1 = require("./weight.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_weight_log_dto_1 = require("./dto/create-weight-log.dto");
let WeightController = class WeightController {
    weightService;
    constructor(weightService) {
        this.weightService = weightService;
    }
    async create(userId, createWeightLogDto) {
        return this.weightService.create(userId, createWeightLogDto);
    }
    async findAll(userId, query) {
        return this.weightService.findAll(userId, {
            startDate: query.startDate,
            endDate: query.endDate,
            limit: query.limit,
        });
    }
    async getTrendAnalysis(userId, days = 30) {
        return this.weightService.getTrendAnalysis(userId, days);
    }
    async findOne(userId, id) {
        return this.weightService.findOne(userId, id);
    }
    async update(userId, id, updateData) {
        return this.weightService.update(userId, id, updateData);
    }
    async remove(userId, id) {
        return this.weightService.remove(userId, id);
    }
};
exports.WeightController = WeightController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_weight_log_dto_1.CreateWeightLogDto]),
    __metadata("design:returntype", Promise)
], WeightController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_weight_log_dto_1.GetWeightLogsDto]),
    __metadata("design:returntype", Promise)
], WeightController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('trend'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WeightController.prototype, "getTrendAnalysis", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WeightController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WeightController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WeightController.prototype, "remove", null);
exports.WeightController = WeightController = __decorate([
    (0, common_1.Controller)('weight'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [weight_service_1.WeightService])
], WeightController);
//# sourceMappingURL=weight.controller.js.map