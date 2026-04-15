import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { User, UserDocument } from '../users/schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID')
    );
  }

  /**
   * Register a new user
   */
  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user and include password field
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    };
  }

  /**
   * Google login user
   */
  async googleLogin(token: string) {
    try {
      let payload: any;
      let googleId: string;
      let avatarUrl: string | undefined;

      // Access tokens usually don't look like JWTs, they start with 'ya29.'
      if (token.startsWith('ya29.') || !token.includes('.')) {
        // It's an access token from useGoogleLogin
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new UnauthorizedException('Invalid Google access token');
        const userData = await res.json();
        payload = userData;
        googleId = userData.sub;
        avatarUrl = userData.picture;
      } else {
        // It's an ID token
        const ticket = await this.googleClient.verifyIdToken({
          idToken: token,
          audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        });
        payload = ticket.getPayload();
        googleId = payload.sub;
        avatarUrl = payload.picture;
      }
      
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const { email, name } = payload;
      const lowercasedEmail = email.toLowerCase();

      // Check if user exists
      let user = await this.userModel.findOne({ email: lowercasedEmail }).exec();

      if (!user) {
        // Create new user for Google login (without password)
        user = await this.userModel.create({
          email: lowercasedEmail,
          name: name || email.split('@')[0],
          googleId,
          avatarUrl,
        });
      } else if (!user.googleId) {
        // Update existing user with googleId if missing
        user.googleId = googleId;
        user.avatarUrl = user.avatarUrl || avatarUrl;
        await user.save();
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Save refresh token
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  /**
   * Logout user - invalidate tokens
   */
  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: undefined,
      refreshTokenExpiresAt: undefined,
    });

    return { message: 'Logout successful' };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    // Find user by refresh token
    const user = await this.userModel
      .findOne({ refreshToken })
      .select('+refreshToken +refreshTokenExpiresAt')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if refresh token is expired
    if (!user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user);

    // Rotate refresh token
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  /**
   * Validate user for JWT strategy
   */
  async validateUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user._id,
      email: user.email,
    };
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: UserDocument) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION', '7d'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Update refresh token in database
   */
  private async updateRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenExpiresAt = new Date();
    const expiration = this.configService.get<string>('REFRESH_TOKEN_EXPIRATION', '7d');

    // Parse expiration (e.g., "7d" -> 7 days)
    const match = expiration.match(/^(\d+)([dhms])$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];

      switch (unit) {
        case 'd':
          refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + value);
          break;
        case 'h':
          refreshTokenExpiresAt.setHours(refreshTokenExpiresAt.getHours() + value);
          break;
        case 'm':
          refreshTokenExpiresAt.setMinutes(refreshTokenExpiresAt.getMinutes() + value);
          break;
        case 's':
          refreshTokenExpiresAt.setSeconds(refreshTokenExpiresAt.getSeconds() + value);
          break;
      }
    } else {
      // Default to 7 days
      refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);
    }

    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken,
      refreshTokenExpiresAt,
    });
  }
}
