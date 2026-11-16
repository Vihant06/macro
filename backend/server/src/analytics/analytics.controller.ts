import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('daily')
  async getDailySummary(
    @CurrentUser('userId') userId: string,
    @Query('date') date: string,
  ) {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }
    return this.analyticsService.getDailySummary(userId, date);
  }

  @Get('weekly')
  async getWeeklyTrends(
    @CurrentUser('userId') userId: string,
    @Query('endDate') endDate?: string,
  ) {
    const date = endDate ? new Date(endDate) : new Date();
    return this.analyticsService.getWeeklyTrends(userId, date);
  }

  @Get('macros')
  async getMacroDistribution(
    @CurrentUser('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    return this.analyticsService.getMacroDistribution(userId, start, end);
  }

  @Get('insights')
  async getProgressInsights(@CurrentUser('userId') userId: string) {
    return this.analyticsService.getProgressInsights(userId);
  }
}
