import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthFacade } from '@app/auth/application/facades/auth.facade';
import { Role } from '@auth/domain/enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authFacade: AuthFacade) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'secret',
		});
	}

	async validate(payload: { sub: string; role: Role }) {
		await this.authFacade.validateUser(payload);

		return {
			email: payload.sub,
			role: payload.role,
		};
	}
}
