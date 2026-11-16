import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateWeightLogDto {
  @IsNotEmpty({ message: 'Weight is required' })
  @IsNumber()
  @Min(0, { message: 'Weight must be positive' })
  weight: number;

  @IsOptional()
  @IsString()
  date?: string; // ISO date string, defaults to today

  @IsOptional()
  @IsNumber()
  @Min(0)
  bodyFatPercentage?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class GetWeightLogsDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
