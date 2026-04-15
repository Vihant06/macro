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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutSessionSchema = exports.WorkoutSession = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let WorkoutSession = class WorkoutSession extends mongoose_2.Document {
    userId;
    workoutName;
    startTime;
    endTime;
    status;
    exercises;
    totalVolume;
    duration;
    totalDuration;
};
exports.WorkoutSession = WorkoutSession;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WorkoutSession.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WorkoutSession.prototype, "workoutName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WorkoutSession.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WorkoutSession.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WorkoutSession.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], WorkoutSession.prototype, "exercises", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WorkoutSession.prototype, "totalVolume", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WorkoutSession.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], WorkoutSession.prototype, "totalDuration", void 0);
exports.WorkoutSession = WorkoutSession = __decorate([
    (0, mongoose_1.Schema)()
], WorkoutSession);
exports.WorkoutSessionSchema = mongoose_1.SchemaFactory.createForClass(WorkoutSession);
exports.WorkoutSessionSchema.index({ userId: 1, startTime: -1 });
exports.WorkoutSessionSchema.index({ userId: 1, status: 1 });
//# sourceMappingURL=workout-session.schema.js.map