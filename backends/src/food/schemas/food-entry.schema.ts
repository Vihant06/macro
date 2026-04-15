import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type FoodEntryDocument = HydratedDocument<FoodEntry>;

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class FoodEntry extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, enum: MealType })
  mealType: MealType;

  @Prop({ required: true })
  foodName: string;

  @Prop({ required: true, min: 0 })
  servingSize: number; // in grams

  // Macros
  @Prop({ required: true, min: 0 })
  calories: number;

  @Prop({ required: true, min: 0 })
  protein: number; // in grams

  @Prop({ required: true, min: 0 })
  carbs: number; // in grams

  @Prop({ required: true, min: 0 })
  fat: number; // in grams

  // Optional: link to recipe
  @Prop({ ref: 'Recipe' })
  recipeId?: string;
}

export const FoodEntrySchema = SchemaFactory.createForClass(FoodEntry);

// Compound index for efficient queries by user and date
FoodEntrySchema.index({ userId: 1, date: -1 });
FoodEntrySchema.index({ userId: 1, mealType: 1, date: -1 });
