import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodEntry, FoodEntrySchema } from '../food/schemas/food-entry.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MacrosController } from './macros.controller';
import { MacrosService } from './macros.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FoodEntry.name, schema: FoodEntrySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MacrosController],
  providers: [MacrosService],
  exports: [MacrosService],
})
export class MacrosModule {}
