import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    private configService;
    private googleClient;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, configService: ConfigService);
    signup(signupDto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            name: string;
            email: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            name: string;
            email: string;
        };
    }>;
    googleLogin(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            name: string;
            email: string;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateUser(userId: string): Promise<{
        userId: any;
        email: string;
    }>;
    private generateTokens;
    private updateRefreshToken;
}
