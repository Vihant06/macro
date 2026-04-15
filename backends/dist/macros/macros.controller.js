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
exports.MacrosController = void 0;
const common_1 = require("@nestjs/common");
const macros_service_1 = require("./macros.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let MacrosController = class MacrosController {
    macrosService;
    constructor(macrosService) {
        this.macrosService = macrosService;
    }
    async getTodayTotals(userId, date) {
        return this.macrosService.getTodayTotals(userId, date);
    }
    async getWeeklySummary(userId, endDate) {
        const date = endDate ? new Date(endDate) : new Date();
        return this.macrosService.getWeeklySummary(userId, date);
    }
    async getMacroDistribution(userId, date) {
        const targetDate = date ? new Date(date) : new Date();
        return this.macrosService.getMacroDistribution(userId, targetDate);
    }
    async getMonthlyTrend(userId, month, year) {
        return this.macrosService.getMonthlyTrend(userId, month, year);
    }
};
exports.MacrosController = MacrosController;
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MacrosController.prototype, "getTodayTotals", null);
__decorate([
    (0, common_1.Get)('week'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MacrosController.prototype, "getWeeklySummary", null);
__decorate([
    (0, common_1.Get)('distribution'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MacrosController.prototype, "getMacroDistribution", null);
__decorate([
    (0, common_1.Get)('monthly'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], MacrosController.prototype, "getMonthlyTrend", null);
exports.MacrosController = MacrosController = __decorate([
    (0, common_1.Controller)('macros'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [macros_service_1.MacrosService])
], MacrosController);
//# sourceMappingURL=macros.controller.js.map