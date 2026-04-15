"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = __importStar(require("supertest"));
const app_module_1 = require("../src/app.module");
describe('Authentication (e2e)', () => {
    let app;
    let accessToken;
    let refreshToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('/auth/signup (POST)', () => {
        it('should register a new user', () => {
            const testUser = {
                name: 'Test User',
                email: `test-${Date.now()}@example.com`,
                password: 'password123',
            };
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send(testUser)
                .expect(201)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data.user).toBeDefined();
                expect(res.body.data.accessToken).toBeDefined();
                expect(res.body.data.refreshToken).toBeDefined();
                expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
            });
        });
        it('should reject duplicate email', async () => {
            const testUser = {
                name: 'Test User',
                email: `duplicate-${Date.now()}@example.com`,
                password: 'password123',
            };
            await request(app.getHttpServer())
                .post('/auth/signup')
                .send(testUser)
                .expect(201);
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send(testUser)
                .expect(409);
        });
        it('should reject invalid email', () => {
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send({
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123',
            })
                .expect(400);
        });
        it('should reject short password', () => {
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: '123',
            })
                .expect(400);
        });
    });
    describe('/auth/login (POST)', () => {
        it('should login with valid credentials', async () => {
            const testUser = {
                name: 'Login Test User',
                email: `login-${Date.now()}@example.com`,
                password: 'password123',
            };
            const signupRes = await request(app.getHttpServer())
                .post('/auth/signup')
                .send(testUser)
                .expect(201);
            accessToken = signupRes.body.data.accessToken;
            refreshToken = signupRes.body.data.refreshToken;
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                email: testUser.email,
                password: testUser.password,
            })
                .expect(200)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data.accessToken).toBeDefined();
                expect(res.body.data.refreshToken).toBeDefined();
            });
        });
        it('should reject invalid credentials', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword',
            })
                .expect(401);
        });
    });
    describe('/auth/refresh (POST)', () => {
        it('should refresh access token', () => {
            return request(app.getHttpServer())
                .post('/auth/refresh')
                .send({ refreshToken })
                .expect(200)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data.accessToken).toBeDefined();
                expect(res.body.data.refreshToken).toBeDefined();
            });
        });
        it('should reject invalid refresh token', () => {
            return request(app.getHttpServer())
                .post('/auth/refresh')
                .send({ refreshToken: 'invalid-token' })
                .expect(401);
        });
    });
    describe('/auth/logout (POST)', () => {
        it('should logout user', () => {
            return request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .expect((res) => {
                expect(res.body.success).toBe(true);
            });
        });
    });
    describe('Protected Routes', () => {
        let testAccessToken;
        beforeAll(async () => {
            const testUser = {
                name: 'Protected Route Test',
                email: `protected-${Date.now()}@example.com`,
                password: 'password123',
            };
            const res = await request(app.getHttpServer())
                .post('/auth/signup')
                .send(testUser);
            testAccessToken = res.body.data.accessToken;
        });
        it('should access protected route with valid token', () => {
            return request(app.getHttpServer())
                .get('/users/profile')
                .set('Authorization', `Bearer ${testAccessToken}`)
                .expect(200);
        });
        it('should reject protected route without token', () => {
            return request(app.getHttpServer())
                .get('/users/profile')
                .expect(401);
        });
        it('should reject protected route with invalid token', () => {
            return request(app.getHttpServer())
                .get('/users/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map