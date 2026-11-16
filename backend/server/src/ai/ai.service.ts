import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private groq: Groq;
  private readonly apiKey: string | undefined;
  private readonly modelName: string;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.modelName = this.configService.get<string>(
      'GROQ_MODEL',
      'openai/gpt-oss-20b',
    );
    
    if (!this.apiKey || this.apiKey === 'your_groq_api_key_here') {
      this.logger.warn('GROQ_API_KEY is not set or is using the placeholder. AI features will fail.');
    } else {
      try {
        this.groq = new Groq({ apiKey: this.apiKey });
        this.logger.log(`Groq AI Service initialized with model: ${this.modelName}`);
      } catch (error) {
        const err = error as { message?: string };
        this.logger.error('Failed to initialize Groq AI support:', err.message);
      }
    }
  }

  async handleChat(userId: string, userMessage: string) {
    if (!this.groq) {
      throw new ServiceUnavailableException(
        'AI Coach is not configured. Add GROQ_API_KEY to backends/.env and restart the backend.',
      );
    }

    // Check usage limits
    const canUseAi = await this.usersService.checkAiUsage(userId);
    if (!canUseAi) {
      throw new BadRequestException('Daily AI request limit reached. Please try again tomorrow.');
    }

    try {
      // Fetch user data for context
      const profile = await this.usersService.getProfile(userId);
      const goals = await this.usersService.getGoals(userId);

      this.logger.log(`[AI Service] Sending request to Groq for user: ${profile.name || 'Unknown'}`);

      const systemPrompt = `
      You are the "Macros AI Coach," a elite fitness and nutrition expert. 
      Your goal is to provide specific, data-driven advice based on the user's current metrics.
      
      USER PROFILE:
      - Name: ${profile.name}
      - Current Weight: ${profile.weight || 'Not set'}kg
      - Goal: ${profile.goal || 'Maintain'}
      - Activity Level: ${profile.activityLevel || 'Sedentary'}
      
      DAILY GOALS:
      - Calories: ${goals.dailyCalories || 'Not calculated'} kcal
      - Protein: ${goals.proteinGrams || '-'}g
      - Carbs: ${goals.carbsGrams || '-'}g
      - Fat: ${goals.fatGrams || '-'}g
      
      STRICT RULES:
      1. ALWAYS respond in valid JSON format.
      2. If you suggest a meal plan, include it in the 'mealPlan' array.
      3. Your responses must stay within the context of fitness, macros, and health.
      
      RESPONSE STRUCTURE (JSON ONLY):
      {
        "text": "Your personalized coaching message here.",
        "mealPlan": [
          { "time": "Breakfast", "meal": "Meal name", "macros": "P: 30g, C: 40g, F: 10g" }
        ],
        "suggestions": ["Quick reply 1", "Quick reply 2"]
      }
      `;

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        model: this.modelName,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const content = chatCompletion.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from Groq');
      }

      const response = this.parseCoachResponse(content);

      // Increment usage count
      await this.usersService.incrementAiUsage(userId);

      this.logger.log('[AI Service] Groq response received and parsed successfully.');
      return response;

    } catch (error) {
  const err = error as { message?: string; response?: { data?: unknown } };

  this.logger.error('Failed to handle chat request:', err.message);

  if (err.response) {
    this.logger.error(`Error Data: ${JSON.stringify(err.response.data)}`);
  }

  if (err.message?.includes('401')) {
    // handle auth error
  }

  if (err.message?.includes('429')) {
    // handle rate limit
  }

  throw new InternalServerErrorException(`AI Coach Error: ${err.message}`);
}
  }

  private parseCoachResponse(content: string): {
  text: string;
  mealPlan: Array<{ time: string; meal: string; macros: string }>;
  suggestions: string[];
} {
  const fencedJson = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
  const firstBrace = content.indexOf('{');
  const lastBrace = content.lastIndexOf('}');
  const jsonText =
    fencedJson ||
    (firstBrace >= 0 && lastBrace > firstBrace
      ? content.slice(firstBrace, lastBrace + 1)
      : '');

  if (!jsonText || !jsonText.trim()) {
    const text = content.trim();
    if (!text) {
      throw new Error('Groq returned an empty coach response');
    }

    return {
      text,
      mealPlan: [],
      suggestions: [],
    };
  }

  const parsed: unknown = JSON.parse(jsonText);

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as { text?: unknown }).text !== 'string'
  ) {
    throw new Error('Groq returned an invalid coach response');
  }

  const response = parsed as {
    text: string;
    mealPlan?: unknown;
    suggestions?: unknown;
  };

  return {
    text: response.text,
    mealPlan: Array.isArray(response.mealPlan) ? response.mealPlan as Array<{ time: string; meal: string; macros: string }> : [],
    suggestions: Array.isArray(response.suggestions)
      ? response.suggestions.filter((suggestion): suggestion is string => typeof suggestion === 'string')
      : [],
  };
  }
}
