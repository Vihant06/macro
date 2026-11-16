import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class WorkoutExerciseDto {
  @IsString()
  exerciseName: string;

  @IsNumber()
  @Min(1)
  targetSets: number;

  @IsNumber()
  @Min(1)
  targetReps: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateWorkoutDto {
  @IsString()
  @IsOptional()
  workoutName?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];
}

export class UpdateWorkoutDto {
  @IsString()
  @IsOptional()
  workoutName?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];

  @IsEnum(['active', 'completed', 'paused'])
  @IsOptional()
  status?: 'active' | 'completed' | 'paused';
}

export class AddExerciseDto {
  @IsString()
  exerciseName: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  targetSets?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  targetReps?: number;
}

export class CompleteSetDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  reps?: number;

  @IsString()
  exerciseName: string;
}
