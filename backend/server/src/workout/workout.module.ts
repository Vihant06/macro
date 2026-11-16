import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';
import { WorkoutSession, WorkoutSessionSchema } from './schemas/workout-session.schema';
import { ExerciseLog, ExerciseLogSchema } from './schemas/exercise-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkoutSession.name, schema: WorkoutSessionSchema },
      { name: ExerciseLog.name, schema: ExerciseLogSchema },
    ]),
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService],
  exports: [WorkoutService],
})
export class WorkoutModule {}
