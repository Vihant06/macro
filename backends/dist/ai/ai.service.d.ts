import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
export declare class AiService {
    private configService;
    private usersService;
    private readonly logger;
    private groq;
    private readonly apiKey;
    private readonly modelName;
    constructor(configService: ConfigService, usersService: UsersService);
    handleChat(userId: string, userMessage: string): Promise<any>;
}
