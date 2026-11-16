import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { MealType } from '../schemas/food-entry.schema';

export class CreateFoodEntryDto {
  @IsNotEmpty({ message: 'Food name is required' })
  @IsString()
  foodName: string;

  @IsNotEmpty({ message: 'Meal type is required' })
  @IsEnum(MealType, { message: 'Invalid meal type' })
  mealType: MealType;

  @IsNotEmpty({ message: 'Date is required' })
  @IsString()
  date: string; // ISO date string

  @IsNotEmpty({ message: 'Serving size is required' })
  @IsNumber()
  @Min(0, { message: 'Serving size must be positive' })
  servingSize: number;

  @IsNotEmpty({ message: 'Calories are required' })
  @IsNumber()
  @Min(0, { message: 'Calories must be positive' })
  calories: number;

  @IsNotEmpty({ message: 'Protein is required' })
  @IsNumber()
  @Min(0, { message: 'Protein must be positive' })
  protein: number;

  @IsNotEmpty({ message: 'Carbs are required' })
  @IsNumber()
  @Min(0, { message: 'Carbs must be positive' })
  carbs: number;

  @IsNotEmpty({ message: 'Fat is required' })
  @IsNumber()
  @Min(0, { message: 'Fat must be positive' })
  fat: number;

  @IsOptional()
  @IsString()
  recipeId?: string;
}

export class UpdateFoodEntryDto {
  @IsOptional()
  @IsString()
  foodName?: string;

  @IsOptional()
  @IsEnum(MealType, { message: 'Invalid meal type' })
  mealType?: MealType;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Serving size must be positive' })
  servingSize?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Calories must be positive' })
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Protein must be positive' })
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Carbs must be positive' })
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Fat must be positive' })
  fat?: number;
}

export class GetFoodEntriesDto {
  @IsOptional()
  @IsString()
  date?: string; // ISO date string

  @IsOptional()
  @IsEnum(MealType)
  mealType?: MealType;
}
