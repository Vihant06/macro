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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const update_user_dto_1 = require("../dto/update-user.dto");
let User = class User extends mongoose_2.Document {
    name;
    email;
    password;
    googleId;
    avatarUrl;
    age;
    gender;
    height;
    weight;
    bodyFat;
    activityLevel;
    goal;
    dailyCalories;
    proteinGrams;
    carbsGrams;
    fatGrams;
    refreshToken;
    refreshTokenExpiresAt;
    aiRequestCount;
    lastAiRequestDate;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 2, maxlength: 50 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ minlength: 6, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: update_user_dto_1.Gender }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], User.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], User.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 100 }),
    __metadata("design:type", Number)
], User.prototype, "bodyFat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: update_user_dto_1.ActivityLevel, default: update_user_dto_1.ActivityLevel.SEDENTARY }),
    __metadata("design:type", String)
], User.prototype, "activityLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: update_user_dto_1.Goal, default: update_user_dto_1.Goal.MAINTAIN }),
    __metadata("design:type", String)
], User.prototype, "goal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 2000 }),
    __metadata("design:type", Number)
], User.prototype, "dailyCalories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 150 }),
    __metadata("design:type", Number)
], User.prototype, "proteinGrams", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 225 }),
    __metadata("design:type", Number)
], User.prototype, "carbsGrams", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 65 }),
    __metadata("design:type", Number)
], User.prototype, "fatGrams", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", Date)
], User.prototype, "refreshTokenExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "aiRequestCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastAiRequestDate", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 });
//# sourceMappingURL=user.schema.js.map