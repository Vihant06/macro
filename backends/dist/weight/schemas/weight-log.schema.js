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
exports.WeightLogSchema = exports.WeightLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let WeightLog = class WeightLog extends mongoose_2.Document {
    userId;
    date;
    weight;
    bodyFatPercentage;
    notes;
};
exports.WeightLog = WeightLog;
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'User' }),
    __metadata("design:type", String)
], WeightLog.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], WeightLog.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], WeightLog.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], WeightLog.prototype, "bodyFatPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeightLog.prototype, "notes", void 0);
exports.WeightLog = WeightLog = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })
], WeightLog);
exports.WeightLogSchema = mongoose_1.SchemaFactory.createForClass(WeightLog);
exports.WeightLogSchema.index({ userId: 1, date: -1 });
//# sourceMappingURL=weight-log.schema.js.map