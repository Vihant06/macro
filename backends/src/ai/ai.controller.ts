import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @CurrentUser('userId') userId: string,
    @Body('message') message: string,
  ) {
    if (!message) {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }
    
    return this.aiService.handleChat(userId, message);
  }
}
