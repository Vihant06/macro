import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecipeIngredientDto {
  @IsNotEmpty({ message: 'Ingredient name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty({ message: 'Unit is required' })
  @IsString()
  unit: string;

  @IsOptional()
  @IsNumber()
  calories?: number;

  @IsOptional()
  @IsNumber()
  protein?: number;

  @IsOptional()
  @IsNumber()
  carbs?: number;

  @IsOptional()
  @IsNumber()
  fat?: number;
}

export class CreateRecipeDto {
  @IsNotEmpty({ message: 'Recipe name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Number of servings is required' })
  @IsNumber()
  @Min(1, { message: 'Recipe must have at least 1 serving' })
  servings: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  prepTimeMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cookTimeMinutes?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients?: RecipeIngredientDto[];

  @IsNotEmpty({ message: 'Calories per serving is required' })
  @IsNumber()
  @Min(0)
  calories: number;

  @IsNotEmpty({ message: 'Protein per serving is required' })
  @IsNumber()
  @Min(0)
  protein: number;

  @IsNotEmpty({ message: 'Carbs per serving is required' })
  @IsNumber()
  @Min(0)
  carbs: number;

  @IsNotEmpty({ message: 'Fat per serving is required' })
  @IsNumber()
  @Min(0)
  fat: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  isPublic?: boolean;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  servings?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  prepTimeMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cookTimeMinutes?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients?: RecipeIngredientDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  isPublic?: boolean;
}
