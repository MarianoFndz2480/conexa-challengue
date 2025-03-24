import { JwtStrategy } from '@auth/infrastructure/strategies/jwt.strategy';
import { AuthFacade } from '@app/auth/application/facades/auth.facade';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@auth/domain/enums/role.enum';

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
			const email = 'user@example.com';
			const role = Role.USER;
			const payload = { sub: email, role };

			jest.spyOn(authFacade, 'validateUser').mockResolvedValue(payload);

			const result = await jwtStrategy.validate(payload);
			expect(result).toEqual({ email, role });
			expect(authFacade.validateUser).toHaveBeenCalledWith(payload);
		});

		it('Should throw UnauthorizedException if validation fails', async () => {
			const payload = { sub: 'invalid@example.com', role: Role.USER };

			jest.spyOn(authFacade, 'validateUser').mockRejectedValue(new UnauthorizedException());

			await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
			expect(authFacade.validateUser).toHaveBeenCalledWith(payload);
		});
	});
});
