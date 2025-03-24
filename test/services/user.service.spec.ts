import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@app/auth/application/services/user.service';
import { UserRepository } from '@app/auth/domain/repositories/user.repository';
import { HashUtil } from '@utils/hash';
import { CredentialsDTO } from '@app/auth/infrastructure/dtos/auth.dto';
import { UserAlreadyExistsError } from '@app/auth/domain/errors/user.error';
import { userMockData } from '@auth/infrastructure/mock-data/user.mock-data';
import { UserMockRepository } from '@app/auth/infrastructure/repositories/user-mock.repository';
import { Role } from '@app/auth/domain/enums/role.enum';

jest.mock('@utils/hash');

describe('UserService tests:', () => {
	let userService: UserService;
	let userRepository: UserRepository;
	let getByEmailSpy: jest.SpyInstance;
	let compareHashSpy: jest.SpyInstance;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService, { provide: 'UserRepository', useClass: UserMockRepository }],
		}).compile();

		userService = module.get<UserService>(UserService);
		userRepository = module.get<UserRepository>('UserRepository');
		getByEmailSpy = jest.spyOn(userRepository, 'getByEmail');
		compareHashSpy = jest.spyOn(HashUtil, 'compareHash');
	});

	afterEach(() => {
		getByEmailSpy.mockClear();
		compareHashSpy.mockClear();
	});

	describe('createUser method:', () => {
		it('Should create a new user if email does not exist', async () => {
			jest.spyOn(userRepository, 'create');
			jest.spyOn(HashUtil, 'generateHash').mockResolvedValue(userMockData.password);

			const credentials: CredentialsDTO = {
				email: 'nonexistent@email.com',
				password: 'password123',
			};
			const result = await userService.createUser(credentials);

			expect(result).toEqual({ ...userMockData, ...credentials, password: userMockData.password });
			expect(userRepository.create).toHaveBeenCalledWith({
				...credentials,
				password: userMockData.password,
				role: Role.USER,
			});
		});

		it('Should throw UserAlreadyExistsError if email already exists', async () => {
			const credentials: CredentialsDTO = {
				email: userMockData.email,
				password: 'password123',
			};

			await expect(userService.createUser(credentials)).rejects.toThrow(UserAlreadyExistsError);
		});
	});

	describe('isValidUser method:', () => {
		it('Should return true if password matches', async () => {
			compareHashSpy.mockResolvedValue(true);

			const result = await userService.isValidUser('password123', userMockData.password);

			expect(result).toBe(true);
			expect(HashUtil.compareHash).toHaveBeenCalledWith('password123', userMockData.password);
		});

		it('Should return false if password does not match', async () => {
			compareHashSpy.mockResolvedValue(false);

			const result = await userService.isValidUser('wrongpassword', userMockData.password);

			expect(result).toBe(false);
			expect(HashUtil.compareHash).toHaveBeenCalledWith('wrongpassword', userMockData.password);
		});
	});

	describe('getByEmail method:', () => {
		it('Should return user when email exists', async () => {
			const result = await userService.getByEmail(userMockData.email);

			expect(result).toEqual(userMockData);
			expect(getByEmailSpy).toHaveBeenCalledWith(userMockData.email);
		});

		it('Should return null when email does not exist', async () => {
			const email = 'nonexistent@email.com';
			const result = await userService.getByEmail(email);

			expect(result).toBeNull();
			expect(getByEmailSpy).toHaveBeenCalledWith(email);
		});
	});
});
