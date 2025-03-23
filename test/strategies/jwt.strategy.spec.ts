import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { AuthFacade } from '@auth/facades/auth.facade';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('JwtStrategy tests:', () => {
	let jwtStrategy: JwtStrategy;
	let authFacade: AuthFacade;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JwtStrategy,
				{
					provide: AuthFacade,
					useValue: {
						validateUser: jest.fn(),
					},
				},
			],
		}).compile();

		jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
		authFacade = module.get<AuthFacade>(AuthFacade);
	});

	describe('validate method:', () => {
		it('Should return user payload if validation succeeds', async () => {
			const payload = { sub: 'user@example.com' };
			jest.spyOn(authFacade, 'validateUser').mockResolvedValue(payload);

			const result = await jwtStrategy.validate(payload);
			expect(result).toEqual(payload);
			expect(authFacade.validateUser).toHaveBeenCalledWith(payload);
		});

		it('Should throw UnauthorizedException if validation fails', async () => {
			const payload = { sub: 'invalid@example.com' };
			jest.spyOn(authFacade, 'validateUser').mockResolvedValue(null);

			await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
			expect(authFacade.validateUser).toHaveBeenCalledWith(payload);
		});
	});
});
