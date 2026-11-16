import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type WorkoutSessionDocument = HydratedDocument<WorkoutSession>;

@Schema()
export class WorkoutSession extends Document {
  @Prop()
  userId!: string;

  @Prop()
  workoutName?: string;

  @Prop()
  startTime!: Date;

  @Prop()
  endTime!: Date;

  @Prop()
  status!: string;

  @Prop()
  exercises!: any[];

  @Prop()
  totalVolume!: number;

  @Prop()
  duration!: number;

  @Prop()
  totalDuration!: number;
}

export const WorkoutSessionSchema = SchemaFactory.createForClass(WorkoutSession);

WorkoutSessionSchema.index({ userId: 1, startTime: -1 });
WorkoutSessionSchema.index({ userId: 1, status: 1 });
