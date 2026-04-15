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
exports.GetFoodEntriesDto = exports.UpdateFoodEntryDto = exports.CreateFoodEntryDto = void 0;
const class_validator_1 = require("class-validator");
const food_entry_schema_1 = require("../schemas/food-entry.schema");
class CreateFoodEntryDto {
    foodName;
    mealType;
    date;
    servingSize;
    calories;
    protein;
    carbs;
    fat;
    recipeId;
}
exports.CreateFoodEntryDto = CreateFoodEntryDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Food name is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFoodEntryDto.prototype, "foodName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Meal type is required' }),
    (0, class_validator_1.IsEnum)(food_entry_schema_1.MealType, { message: 'Invalid meal type' }),
    __metadata("design:type", String)
], CreateFoodEntryDto.prototype, "mealType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Date is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFoodEntryDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Serving size is required' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Serving size must be positive' }),
    __metadata("design:type", Number)
], CreateFoodEntryDto.prototype, "servingSize", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Calories are required' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Calories must be positive' }),
    __metadata("design:type", Number)
], CreateFoodEntryDto.prototype, "calories", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Protein is required' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Protein must be positive' }),
    __metadata("design:type", Number)
], CreateFoodEntryDto.prototype, "protein", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Carbs are required' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Carbs must be positive' }),
    __metadata("design:type", Number)
], CreateFoodEntryDto.prototype, "carbs", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Fat is required' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Fat must be positive' }),
    __metadata("design:type", Number)
], CreateFoodEntryDto.prototype, "fat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFoodEntryDto.prototype, "recipeId", void 0);
class UpdateFoodEntryDto {
    foodName;
    mealType;
    servingSize;
    calories;
    protein;
    carbs;
    fat;
}
exports.UpdateFoodEntryDto = UpdateFoodEntryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFoodEntryDto.prototype, "foodName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(food_entry_schema_1.MealType, { message: 'Invalid meal type' }),
    __metadata("design:type", String)
], UpdateFoodEntryDto.prototype, "mealType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Serving size must be positive' }),
    __metadata("design:type", Number)
], UpdateFoodEntryDto.prototype, "servingSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Calories must be positive' }),
    __metadata("design:type", Number)
], UpdateFoodEntryDto.prototype, "calories", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Protein must be positive' }),
    __metadata("design:type", Number)
], UpdateFoodEntryDto.prototype, "protein", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Carbs must be positive' }),
    __metadata("design:type", Number)
], UpdateFoodEntryDto.prototype, "carbs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Fat must be positive' }),
    __metadata("design:type", Number)
], UpdateFoodEntryDto.prototype, "fat", void 0);
class GetFoodEntriesDto {
    date;
    mealType;
}
exports.GetFoodEntriesDto = GetFoodEntriesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetFoodEntriesDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(food_entry_schema_1.MealType),
    __metadata("design:type", String)
], GetFoodEntriesDto.prototype, "mealType", void 0);
//# sourceMappingURL=create-food-entry.dto.js.map