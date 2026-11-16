import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateWorkoutDto, AddExerciseDto, CompleteSetDto, UpdateWorkoutDto } from './dto/create-workout.dto';

@Controller('workout')
@UseGuards(JwtAuthGuard)
export class WorkoutController {
  constructor(private workoutService: WorkoutService) {}

  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  async start(
    @CurrentUser('userId') userId: string,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ) {
    return this.workoutService.start(userId, createWorkoutDto);
  }

  @Get('active')
  async getActive(@CurrentUser('userId') userId: string) {
    return this.workoutService.getActiveSession(userId);
  }

  @Post(':sessionId/exercise')
  @HttpCode(HttpStatus.CREATED)
  async addExercise(
    @CurrentUser('userId') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() addExerciseDto: AddExerciseDto,
  ) {
    return this.workoutService.addExercise(userId, sessionId, addExerciseDto);
  }

  @Post(':sessionId/complete-set')
  async completeSet(
    @CurrentUser('userId') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() completeSetDto: CompleteSetDto,
  ) {
    return this.workoutService.completeSet(
      userId,
      sessionId,
      completeSetDto.exerciseName,
      completeSetDto,
    );
  }

  @Get(':sessionId/exercises')
  async getSessionExercises(
    @CurrentUser('userId') userId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.workoutService.getSessionExercises(userId, sessionId);
  }

  @Patch(':sessionId')
  async update(
    @CurrentUser('userId') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() updateData: UpdateWorkoutDto,
  ) {
    return this.workoutService.update(userId, sessionId, updateData);
  }

  @Patch('update/:sessionId')
  async updateProgress(
    @CurrentUser('userId') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() updateData: UpdateWorkoutDto,
  ) {
    return this.workoutService.updateProgress(userId, sessionId, updateData);
  }

  @Post(':sessionId/end')
  async end(
    @CurrentUser('userId') userId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.workoutService.end(userId, sessionId);
  }

  @Get('history')
  async getHistory(
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.workoutService.getHistory(userId, parseInt(limit || '10', 10));
  }
}
