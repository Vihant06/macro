import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MacrosService } from './macros.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('macros')
@UseGuards(JwtAuthGuard)
export class MacrosController {
  constructor(private macrosService: MacrosService) {}

  @Get('today')
  async getTodayTotals(
    @CurrentUser('userId') userId: string,
    @Query('date') date?: string,
  ) {
    return this.macrosService.getTodayTotals(userId, date);
  }

  @Get('week')
  async getWeeklySummary(
    @CurrentUser('userId') userId: string,
    @Query('endDate') endDate?: string,
  ) {
    const date = endDate ? new Date(endDate) : new Date();
    return this.macrosService.getWeeklySummary(userId, date);
  }

  @Get('distribution')
  async getMacroDistribution(
    @CurrentUser('userId') userId: string,
    @Query('date') date?: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();
    return this.macrosService.getMacroDistribution(userId, targetDate);
  }

  @Get('monthly')
  async getMonthlyTrend(
    @CurrentUser('userId') userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.macrosService.getMonthlyTrend(userId, month, year);
  }
}
