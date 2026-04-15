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
exports.WorkoutController = void 0;
const common_1 = require("@nestjs/common");
const workout_service_1 = require("./workout.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_workout_dto_1 = require("./dto/create-workout.dto");
let WorkoutController = class WorkoutController {
    workoutService;
    constructor(workoutService) {
        this.workoutService = workoutService;
    }
    async start(userId, createWorkoutDto) {
        return this.workoutService.start(userId, createWorkoutDto);
    }
    async getActive(userId) {
        return this.workoutService.getActiveSession(userId);
    }
    async addExercise(userId, sessionId, addExerciseDto) {
        return this.workoutService.addExercise(userId, sessionId, addExerciseDto);
    }
    async completeSet(userId, sessionId, completeSetDto) {
        return this.workoutService.completeSet(userId, sessionId, completeSetDto.exerciseName, completeSetDto);
    }
    async getSessionExercises(userId, sessionId) {
        return this.workoutService.getSessionExercises(userId, sessionId);
    }
    async update(userId, sessionId, updateData) {
        return this.workoutService.update(userId, sessionId, updateData);
    }
    async updateProgress(userId, sessionId, updateData) {
        return this.workoutService.updateProgress(userId, sessionId, updateData);
    }
    async end(userId, sessionId) {
        return this.workoutService.end(userId, sessionId);
    }
    async getHistory(userId, limit) {
        return this.workoutService.getHistory(userId, parseInt(limit || '10', 10));
    }
};
exports.WorkoutController = WorkoutController;
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_workout_dto_1.CreateWorkoutDto]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "start", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "getActive", null);
__decorate([
    (0, common_1.Post)(':sessionId/exercise'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_workout_dto_1.AddExerciseDto]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "addExercise", null);
__decorate([
    (0, common_1.Post)(':sessionId/complete-set'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_workout_dto_1.CompleteSetDto]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "completeSet", null);
__decorate([
    (0, common_1.Get)(':sessionId/exercises'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "getSessionExercises", null);
__decorate([
    (0, common_1.Patch)(':sessionId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_workout_dto_1.UpdateWorkoutDto]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('update/:sessionId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_workout_dto_1.UpdateWorkoutDto]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Post)(':sessionId/end'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "end", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "getHistory", null);
exports.WorkoutController = WorkoutController = __decorate([
    (0, common_1.Controller)('workout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [workout_service_1.WorkoutService])
], WorkoutController);
//# sourceMappingURL=workout.controller.js.map