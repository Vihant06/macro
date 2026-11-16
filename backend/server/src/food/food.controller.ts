import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  CreateFoodEntryDto,
  UpdateFoodEntryDto,
  GetFoodEntriesDto,
} from './dto/create-food-entry.dto';

@Controller('food')
@UseGuards(JwtAuthGuard)
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createFoodEntryDto: CreateFoodEntryDto,
  ) {
    return this.foodService.create(userId, createFoodEntryDto);
  }

  @Get()
  async findAll(
    @CurrentUser('userId') userId: string,
    @Query() query: GetFoodEntriesDto,
  ) {
    return this.foodService.findAll(userId, query.date, query.mealType);
  }

  @Get('daily-totals')
  async getDailyTotals(
    @CurrentUser('userId') userId: string,
    @Query('date') date: string,
  ) {
    return this.foodService.getDailyTotals(userId, date);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.foodService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateFoodEntryDto,
  ) {
    return this.foodService.update(userId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.foodService.remove(userId, id);
  }
}
