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
exports.FoodEntrySchema = exports.FoodEntry = exports.MealType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var MealType;
(function (MealType) {
    MealType["BREAKFAST"] = "breakfast";
    MealType["LUNCH"] = "lunch";
    MealType["DINNER"] = "dinner";
    MealType["SNACK"] = "snack";
})(MealType || (exports.MealType = MealType = {}));
let FoodEntry = class FoodEntry extends mongoose_2.Document {
    userId;
    date;
    mealType;
    foodName;
    servingSize;
    calories;
    protein;
    carbs;
    fat;
    recipeId;
};
exports.FoodEntry = FoodEntry;
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'User' }),
    __metadata("design:type", String)
], FoodEntry.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], FoodEntry.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: MealType }),
    __metadata("design:type", String)
], FoodEntry.prototype, "mealType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FoodEntry.prototype, "foodName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], FoodEntry.prototype, "servingSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], FoodEntry.prototype, "calories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], FoodEntry.prototype, "protein", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], FoodEntry.prototype, "carbs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], FoodEntry.prototype, "fat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Recipe' }),
    __metadata("design:type", String)
], FoodEntry.prototype, "recipeId", void 0);
exports.FoodEntry = FoodEntry = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })
], FoodEntry);
exports.FoodEntrySchema = mongoose_1.SchemaFactory.createForClass(FoodEntry);
exports.FoodEntrySchema.index({ userId: 1, date: -1 });
exports.FoodEntrySchema.index({ userId: 1, mealType: 1, date: -1 });
//# sourceMappingURL=food-entry.schema.js.map