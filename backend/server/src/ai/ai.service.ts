import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly pythonAiUrl: string;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.pythonAiUrl = this.configService.get<string>(
      'PYTHON_AI_URL',
      'http://localhost:8000',
    );
    this.logger.log(`LangGraph Python AI service target URL: ${this.pythonAiUrl}`);
  }

  async handleChat(userId: string, userMessage: string) {
    // Check usage limits
    const canUseAi = await this.usersService.checkAiUsage(userId);
    if (!canUseAi) {
      throw new BadRequestException(
        'Daily AI request limit reached. Please try again tomorrow.',
      );
    }

    try {
      const profile = await this.usersService.getProfile(userId);

      this.logger.log(
        `[AI Service] Forwarding to Python LangGraph for user: ${profile?.name || userId}`,
      );

      const targetEndpoint = `${this.pythonAiUrl.replace(/\/$/, '')}/ai/chat`;

      const response = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
        body: JSON.stringify({
          message: userMessage,
          thread_id: userId,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(
          `Python AI backend returned ${response.status}: ${errText}`,
        );
        throw new Error(
          `LangGraph AI service returned error (${response.status}): ${errText}`,
        );
      }

      const result = (await response.json()) as any;

      // Increment usage count
      await this.usersService.incrementAiUsage(userId);

      const aiData = result.data || result;
      const text =
        aiData.text ||
        aiData.response ||
        'I processed your request using the LangGraph fitness assistant.';

      return {
        text,
        mealPlan: aiData.mealPlan || [],
        suggestions: aiData.suggestions || [
          'Adjust my calories',
          'What should I eat?',
          'Log a workout',
          'My macro targets',
        ],
      };
    } catch (error) {
      const err = error as { message?: string };
      this.logger.error(
        'Failed to contact LangGraph AI backend:',
        err.message,
      );

      throw new ServiceUnavailableException(
        `AI Coach (LangGraph) service is unavailable: ${err.message}. Please verify PYTHON_AI_URL on Render.`,
      );
    }
  }
}
