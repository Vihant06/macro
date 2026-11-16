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
import { WeightService } from './weight.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateWeightLogDto, GetWeightLogsDto } from './dto/create-weight-log.dto';

@Controller('weight')
@UseGuards(JwtAuthGuard)
export class WeightController {
  constructor(private weightService: WeightService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createWeightLogDto: CreateWeightLogDto,
  ) {
    return this.weightService.create(userId, createWeightLogDto);
  }

  @Get()
  async findAll(
    @CurrentUser('userId') userId: string,
    @Query() query: GetWeightLogsDto,
  ) {
    return this.weightService.findAll(userId, {
      startDate: query.startDate,
      endDate: query.endDate,
      limit: query.limit,
    });
  }

  @Get('trend')
  async getTrendAnalysis(
    @CurrentUser('userId') userId: string,
    @Query('days') days: number = 30,
  ) {
    return this.weightService.getTrendAnalysis(userId, days);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.weightService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() updateData: Partial<CreateWeightLogDto>,
  ) {
    return this.weightService.update(userId, id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.weightService.remove(userId, id);
  }
}
