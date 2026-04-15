import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodEntry, FoodEntrySchema } from '../food/schemas/food-entry.schema';
import { WeightLog, WeightLogSchema } from '../weight/schemas/weight-log.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FoodEntry.name, schema: FoodEntrySchema },
      { name: WeightLog.name, schema: WeightLogSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
