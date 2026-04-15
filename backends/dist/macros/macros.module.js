"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MacrosModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const food_entry_schema_1 = require("../food/schemas/food-entry.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const macros_controller_1 = require("./macros.controller");
const macros_service_1 = require("./macros.service");
let MacrosModule = class MacrosModule {
};
exports.MacrosModule = MacrosModule;
exports.MacrosModule = MacrosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: food_entry_schema_1.FoodEntry.name, schema: food_entry_schema_1.FoodEntrySchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [macros_controller_1.MacrosController],
        providers: [macros_service_1.MacrosService],
        exports: [macros_service_1.MacrosService],
    })
], MacrosModule);
//# sourceMappingURL=macros.module.js.map