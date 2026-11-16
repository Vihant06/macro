import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateGoalsDto, CalculateGoalsDto } from './dto/update-goals.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Get('goals')
  async getGoals(@CurrentUser('userId') userId: string) {
    return this.usersService.getGoals(userId);
  }

  @Patch('goals')
  async updateGoals(
    @CurrentUser('userId') userId: string,
    @Body() goals: {
      dailyCalories?: number;
      proteinGrams?: number;
      carbsGrams?: number;
      fatGrams?: number;
    },
  ) {
    return this.usersService.updateGoals(userId, goals);
  }

  @Post('goals/calculate')
  async calculateGoals(
    @CurrentUser('userId') userId: string,
    @Body() calculateDto: CalculateGoalsDto,
  ) {
    return this.usersService.calculateGoals(userId, calculateDto);
  }
}
