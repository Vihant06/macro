import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FoodModule } from './food/food.module';
import { MacrosModule } from './macros/macros.module';
import { WeightModule } from './weight/weight.module';
import { RecipesModule } from './recipes/recipes.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { WorkoutModule } from './workout/workout.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // Connection options for production
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }),
      inject: [ConfigService],
    }),

    // JWT Module (configured in AuthModule but available globally)
    JwtModule.register({
      global: true,
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    FoodModule,
    MacrosModule,
    WeightModule,
    RecipesModule,
    AnalyticsModule,
    AiModule,
    WorkoutModule,
  ],
})
export class AppModule {}
