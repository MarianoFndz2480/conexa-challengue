import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthFacade } from '@app/auth/application/facades/auth.facade';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authFacade: AuthFacade) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'secret',
		});
	}

	async validate(payload: { sub: string }) {
		const user = await this.authFacade.validateUser(payload);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
