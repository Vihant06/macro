import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type WeightLogDocument = HydratedDocument<WeightLog>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class WeightLog extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, min: 0 })
  weight: number; // in kg

  @Prop({ min: 0 })
  bodyFatPercentage?: number; // optional

  @Prop()
  notes?: string;
}

export const WeightLogSchema = SchemaFactory.createForClass(WeightLog);

// Index for efficient queries
WeightLogSchema.index({ userId: 1, date: -1 });
