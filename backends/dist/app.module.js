"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const food_module_1 = require("./food/food.module");
const macros_module_1 = require("./macros/macros.module");
const weight_module_1 = require("./weight/weight.module");
const recipes_module_1 = require("./recipes/recipes.module");
const analytics_module_1 = require("./analytics/analytics.module");
const ai_module_1 = require("./ai/ai.module");
const workout_module_1 = require("./workout/workout.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                    maxPoolSize: 10,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                }),
                inject: [config_1.ConfigService],
            }),
            jwt_1.JwtModule.register({
                global: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            food_module_1.FoodModule,
            macros_module_1.MacrosModule,
            weight_module_1.WeightModule,
            recipes_module_1.RecipesModule,
            analytics_module_1.AnalyticsModule,
            ai_module_1.AiModule,
            workout_module_1.WorkoutModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map