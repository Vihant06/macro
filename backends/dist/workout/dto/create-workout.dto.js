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
exports.CompleteSetDto = exports.AddExerciseDto = exports.UpdateWorkoutDto = exports.CreateWorkoutDto = exports.WorkoutExerciseDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class WorkoutExerciseDto {
    exerciseName;
    targetSets;
    targetReps;
    notes;
}
exports.WorkoutExerciseDto = WorkoutExerciseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WorkoutExerciseDto.prototype, "exerciseName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], WorkoutExerciseDto.prototype, "targetSets", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], WorkoutExerciseDto.prototype, "targetReps", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WorkoutExerciseDto.prototype, "notes", void 0);
class CreateWorkoutDto {
    workoutName;
    exercises;
}
exports.CreateWorkoutDto = CreateWorkoutDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWorkoutDto.prototype, "workoutName", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkoutExerciseDto),
    __metadata("design:type", Array)
], CreateWorkoutDto.prototype, "exercises", void 0);
class UpdateWorkoutDto {
    workoutName;
    exercises;
    status;
}
exports.UpdateWorkoutDto = UpdateWorkoutDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkoutDto.prototype, "workoutName", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkoutExerciseDto),
    __metadata("design:type", Array)
], UpdateWorkoutDto.prototype, "exercises", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['active', 'completed', 'paused']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWorkoutDto.prototype, "status", void 0);
class AddExerciseDto {
    exerciseName;
    notes;
    targetSets;
    targetReps;
}
exports.AddExerciseDto = AddExerciseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddExerciseDto.prototype, "exerciseName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddExerciseDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddExerciseDto.prototype, "targetSets", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddExerciseDto.prototype, "targetReps", void 0);
class CompleteSetDto {
    weight;
    reps;
    exerciseName;
}
exports.CompleteSetDto = CompleteSetDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CompleteSetDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CompleteSetDto.prototype, "reps", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteSetDto.prototype, "exerciseName", void 0);
//# sourceMappingURL=create-workout.dto.js.map