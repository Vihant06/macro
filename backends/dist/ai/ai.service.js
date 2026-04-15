"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
let AiService = AiService_1 = class AiService {
    configService;
    usersService;
    logger = new common_1.Logger(AiService_1.name);
    groq;
    apiKey;
    modelName = 'llama-3.3-70b-versatile';
    constructor(configService, usersService) {
        this.configService = configService;
        this.usersService = usersService;
        this.apiKey = this.configService.get('GROQ_API_KEY');
        if (!this.apiKey || this.apiKey === 'your_groq_api_key_here') {
            this.logger.warn('GROQ_API_KEY is not set or is using the placeholder. AI features will fail.');
        }
        else {
            try {
                this.groq = new groq_sdk_1.default({ apiKey: this.apiKey });
                this.logger.log(`Groq AI Service initialized with model: ${this.modelName}`);
            }
            catch (error) {
                const err = error;
                this.logger.error('Failed to initialize Groq AI support:', err.message);
            }
        }
    }
    async handleChat(userId, userMessage) {
        if (!this.groq) {
            throw new common_1.InternalServerErrorException('AI Coach is not configured. Please check GROQ_API_KEY.');
        }
        const canUseAi = await this.usersService.checkAiUsage(userId);
        if (!canUseAi) {
            throw new common_1.BadRequestException('Daily AI request limit reached. Please try again tomorrow.');
        }
        try {
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
                response_format: { type: 'json_object' },
                temperature: 0.7,
                max_tokens: 1024,
            });
            const content = chatCompletion.choices[0]?.message?.content;
            if (!content) {
                throw new Error('Empty response from Groq');
            }
            await this.usersService.incrementAiUsage(userId);
            this.logger.log('[AI Service] Groq response received and parsed successfully.');
            return JSON.parse(content);
        }
        catch (error) {
            const err = error;
            this.logger.error('Failed to handle chat request:', err.message);
            if (err.response) {
                this.logger.error(`Error Data: ${JSON.stringify(err.response.data)}`);
            }
            if (err.message?.includes('401')) {
            }
            if (err.message?.includes('429')) {
            }
            throw new common_1.InternalServerErrorException(`AI Coach Error: ${err.message}`);
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], AiService);
//# sourceMappingURL=ai.service.js.map