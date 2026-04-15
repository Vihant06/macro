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
exports.ExerciseLogSchema = exports.ExerciseLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ExerciseLog = class ExerciseLog extends mongoose_2.Document {
    userId;
    sessionId;
    exerciseName;
    targetSets;
    targetReps;
    sets;
    notes;
    totalVolume;
};
exports.ExerciseLog = ExerciseLog;
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'User' }),
    __metadata("design:type", String)
], ExerciseLog.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'WorkoutSession' }),
    __metadata("design:type", String)
], ExerciseLog.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ExerciseLog.prototype, "exerciseName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ExerciseLog.prototype, "targetSets", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ExerciseLog.prototype, "targetReps", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ completed: Boolean, weight: Number, reps: Number, timestamp: Date }],
        default: [],
    }),
    __metadata("design:type", Array)
], ExerciseLog.prototype, "sets", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ExerciseLog.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ExerciseLog.prototype, "totalVolume", void 0);
exports.ExerciseLog = ExerciseLog = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })
], ExerciseLog);
exports.ExerciseLogSchema = mongoose_1.SchemaFactory.createForClass(ExerciseLog);
exports.ExerciseLogSchema.index({ sessionId: 1, exerciseName: 1 });
exports.ExerciseLogSchema.index({ userId: 1, exerciseName: 1 });
//# sourceMappingURL=exercise-log.schema.js.map