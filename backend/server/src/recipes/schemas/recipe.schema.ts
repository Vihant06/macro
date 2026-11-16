import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Recipe extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 1 })
  servings: number;

  @Prop({ required: true, min: 0 })
  prepTimeMinutes?: number;

  @Prop({ required: true, min: 0 })
  cookTimeMinutes?: number;

  @Prop({ default: [] })
  ingredients: RecipeIngredient[];

  // Total macros per serving
  @Prop({ required: true, min: 0 })
  calories: number;

  @Prop({ required: true, min: 0 })
  protein: number; // grams

  @Prop({ required: true, min: 0 })
  carbs: number; // grams

  @Prop({ required: true, min: 0 })
  fat: number; // grams

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: true })
  isPublic: boolean;
}

export class RecipeIngredient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  unit: string;

  @Prop()
  calories?: number;

  @Prop()
  protein?: number;

  @Prop()
  carbs?: number;

  @Prop()
  fat?: number;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);

// Index for efficient queries
RecipeSchema.index({ userId: 1, name: 1 });
RecipeSchema.index({ userId: 1, tags: 1 });
