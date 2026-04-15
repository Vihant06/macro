import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ExerciseLogDocument = HydratedDocument<ExerciseLog>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class ExerciseLog extends Document {
  @Prop({ required: true, ref: 'User' })
  userId!: string;

  @Prop({ required: true, ref: 'WorkoutSession' })
  sessionId!: string;

  @Prop({ required: true })
  exerciseName!: string;

  @Prop({ required: true })
  targetSets!: number;

  @Prop({ required: true })
  targetReps!: number;

  @Prop({
    type: [{ completed: Boolean, weight: Number, reps: Number, timestamp: Date }],
    default: [],
  })
  sets!: Array<{
    completed: boolean;
    weight: number;
    reps: number;
    timestamp: Date;
  }>;

  @Prop({ default: '' })
  notes?: string;

  @Prop({ default: 0 })
  totalVolume!: number;
}

export const ExerciseLogSchema = SchemaFactory.createForClass(ExerciseLog);

ExerciseLogSchema.index({ sessionId: 1, exerciseName: 1 });
ExerciseLogSchema.index({ userId: 1, exerciseName: 1 });