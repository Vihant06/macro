import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateGoalsDto {
  @IsOptional()
  @IsNumber()
  dailyCalories?: number;

  @IsOptional()
  @IsNumber()
  proteinGrams?: number;

  @IsOptional()
  @IsNumber()
  carbsGrams?: number;

  @IsOptional()
  @IsNumber()
  fatGrams?: number;
}

export class CalculateGoalsDto {
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number; // kg

  @IsNotEmpty()
  @IsNumber()
  height: number; // cm

  @IsOptional()
  @IsNumber()
  bodyFat?: number; // percentage

  @IsNotEmpty()
  @IsNumber()
  activityLevel: number; // 1-5 scale

  @IsNotEmpty()
  @IsNumber()
  goal: number; // -1 for loss, 0 for maintain, 1 for gain
}
