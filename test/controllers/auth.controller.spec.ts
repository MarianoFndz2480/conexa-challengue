import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthController } from '@app/auth/infrastructure/controllers/auth.controller';
import { AuthFacade } from '@app/auth/application/facades/auth.facade';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { UnauthorizedError } from '@app/auth/domain/errors/auth.error';
import { UserAlreadyExistsError } from '@app/auth/domain/errors/user.error';
import { ErrorInterceptor } from '@common/interceptors/error.interceptor';

describe('AuthController integration tests:', () => {
	let app: INestApplication;
	let authFacade: AuthFacade;
	let loginSpy: jest.SpyInstance;
	let signUpSpy: jest.SpyInstance;

	const mockAuthFacade = {
		login: jest.fn(),
		signup: jest.fn(),
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthFacade,
					useValue: mockAuthFacade,
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		app.useGlobalInterceptors(new ErrorInterceptor());
		await app.init();

		authFacade = moduleFixture.get<AuthFacade>(AuthFacade);
		loginSpy = jest.spyOn(authFacade, 'login').mockResolvedValue({ accessToken: 'valid_token' });
		signUpSpy = jest.spyOn(authFacade, 'signup').mockResolvedValue({ accessToken: 'new_user_token' });
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('/login (POST)', () => {
		it('Should return an access token for valid user', async () => {
			const response = await request(app.getHttpServer() as App)
				.post('/auth/login')
				.send({ email: 'user1@example.com', password: 'password123' });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ accessToken: 'valid_token' });
		});

		it('Should return 401 Unauthorized for invalid user', async () => {
			loginSpy.mockRejectedValue(new UnauthorizedError());

			const response = await request(app.getHttpServer() as App)
				.post('/auth/login')
				.send({ email: 'invalid@example.com', password: 'wrongpassword' });

			expect(response.status).toBe(401);
		});

		it('Should return 400 Bad Request for missing email', async () => {
			const response = await request(app.getHttpServer() as App)
				.post('/auth/login')
				.send({ password: 'password123' });

			expect(response.status).toBe(400);
		});

		it('Should return 400 Bad Request for missing password', async () => {
			const response = await request(app.getHttpServer() as App)
				.post('/auth/login')
				.send({ email: 'test@example.com' });

			expect(response.status).toBe(400);
		});
	});

	describe('/signup (POST)', () => {
		it('Should return an access token for successful signup', async () => {
			const response = await request(app.getHttpServer() as App)
				.post('/auth/signup')
				.send({ email: 'new@example.com', password: 'password123' });

			expect(response.status).toBe(201);
			expect(response.body).toEqual({ accessToken: 'new_user_token' });
		});

		it('Should return 409 Conflict for existing user', async () => {
			signUpSpy.mockRejectedValue(new UserAlreadyExistsError());

			const response = await request(app.getHttpServer() as App)
				.post('/auth/signup')
				.send({ email: 'existing@example.com', password: 'password123' });

			expect(response.status).toBe(409);
		});

		it('Should return 400 Bad Request for invalid email format', async () => {
			const response = await request(app.getHttpServer() as App)
				.post('/auth/signup')
				.send({ email: 'invalid-email', password: 'password123' });

			expect(response.status).toBe(400);
		});

		it('Should return 400 Bad Request for short password', async () => {
			const response = await request(app.getHttpServer() as App)
				.post('/auth/signup')
				.send({ email: 'test@example.com', password: '123' });

			expect(response.status).toBe(400);
		});
	});
});
