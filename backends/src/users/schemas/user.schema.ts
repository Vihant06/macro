import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Gender, ActivityLevel, Goal } from '../dto/update-user.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User extends Document {
  @Prop({ required: true, minlength: 2, maxlength: 50 })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ minlength: 6, select: false })
  password?: string;

  @Prop()
  googleId?: string;

  @Prop()
  avatarUrl?: string;

  // Profile information
  @Prop()
  age?: number;

  @Prop({ enum: Gender })
  gender?: Gender;

  @Prop({ min: 0 }) // height in cm
  height?: number;

  @Prop({ min: 0 }) // weight in kg
  weight?: number;

  @Prop({ min: 0, max: 100 }) // body fat percentage
  bodyFat?: number;

  // Activity and goals
  @Prop({ enum: ActivityLevel, default: ActivityLevel.SEDENTARY })
  activityLevel: ActivityLevel;

  @Prop({ enum: Goal, default: Goal.MAINTAIN })
  goal: Goal;

  // Macro goals (daily targets)
  @Prop({ default: 2000 })
  dailyCalories: number;

  @Prop({ default: 150 })
  proteinGrams: number;

  @Prop({ default: 225 })
  carbsGrams: number;

  @Prop({ default: 65 })
  fatGrams: number;

  // Token management for refresh token rotation
  @Prop({ select: false })
  refreshToken?: string;

  @Prop({ select: false })
  refreshTokenExpiresAt?: Date;

  // AI Usage tracking
  @Prop({ default: 0 })
  aiRequestCount: number;

  @Prop()
  lastAiRequestDate?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for efficient queries
UserSchema.index({ email: 1 });
