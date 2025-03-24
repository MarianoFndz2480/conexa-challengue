import { Test, TestingModule } from '@nestjs/testing';
import { AuthFacade } from '@app/auth/application/facades/auth.facade';
import { UserService } from '@app/auth/application/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedError } from '@app/auth/domain/errors/auth.error';
import { UserAlreadyExistsError } from '@app/auth/domain/errors/user.error';
import { userMockData } from '@auth/infrastructure/mock-data/user.mock-data';
import { CredentialsDTO } from '@app/auth/infrastructure/dtos/auth.dto';

describe('AuthFacade tests:', () => {
	let authFacade: AuthFacade;
	let userService: UserService;
	let jwtService: JwtService;
	let getByEmailSpy: jest.SpyInstance;
	let isValidUserSpy: jest.SpyInstance;
	let createUserSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthFacade,
				{
					provide: UserService,
					useValue: {
						isValidUser: jest.fn(),
						createUser: jest.fn(),
						getByEmail: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn().mockReturnValue('mocked_token'),
					},
				},
			],
		}).compile();

		authFacade = module.get<AuthFacade>(AuthFacade);
		userService = module.get<UserService>(UserService);
		jwtService = module.get<JwtService>(JwtService);

		getByEmailSpy = jest.spyOn(userService, 'getByEmail').mockResolvedValue(userMockData);
		isValidUserSpy = jest.spyOn(userService, 'isValidUser').mockResolvedValue(true);
		createUserSpy = jest.spyOn(userService, 'createUser').mockResolvedValue(userMockData);
	});

	describe('validateUser method:', () => {
		it('Should return payload if user exists', async () => {
			const payload = { sub: userMockData.email };
			const result = await authFacade.validateUser(payload);

			expect(result).toEqual(payload);
		});

		it('Should return null if user does not exist', async () => {
			getByEmailSpy.mockResolvedValue(null);

			const payload = { sub: 'nonexistent@example.com' };

			await expect(authFacade.validateUser(payload)).rejects.toThrow(UnauthorizedError);
		});
	});

	describe('login method:', () => {
		it('Should return access token if user is valid', async () => {
			const credentials: CredentialsDTO = {
				email: userMockData.email,
				password: 'password123',
			};
			const result = await authFacade.login(credentials);

			expect(result).toEqual({ accessToken: 'mocked_token' });
			expect(jwtService.sign).toHaveBeenCalledWith({ sub: credentials.email, role: userMockData.role });
		});

		it('Should throw UnauthorizedError if user is invalid', async () => {
			isValidUserSpy.mockResolvedValue(false);

			const credentials: CredentialsDTO = {
				email: 'invalid@example.com',
				password: 'wrongpass',
			};

			await expect(authFacade.login(credentials)).rejects.toThrow(UnauthorizedError);
		});
	});

	describe('signup method:', () => {
		it('Should return access token if user is created successfully', async () => {
			const credentials: CredentialsDTO = {
				email: userMockData.email,
				password: 'password',
			};
			const result = await authFacade.signup(credentials);

			expect(result).toEqual({ accessToken: 'mocked_token' });
			expect(jwtService.sign).toHaveBeenCalledWith({ sub: credentials.email, role: userMockData.role });
		});

		it('Should throw UserAlreadyExistsError if user already exists', async () => {
			createUserSpy.mockRejectedValue(new UserAlreadyExistsError());

			const credentials: CredentialsDTO = {
				email: userMockData.email,
				password: 'password123',
			};

			await expect(authFacade.signup(credentials)).rejects.toThrow(UserAlreadyExistsError);
		});
	});
});
