import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@auth/services/user.service';
import { UnauthorizedError } from '@auth/errors/auth.error';
import { AccessTokenDTO, CredentialsDTO } from '@auth/dtos/auth.dto';
import { User } from '@auth/entities/user.entity';

@Injectable()
export class AuthFacade {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	async validateUser(payload: { sub: string }) {
		const isValidUser = await this.userService.getByEmail(payload.sub);

		if (!isValidUser) return null;

		return payload;
	}

	async login(credentials: CredentialsDTO): Promise<AccessTokenDTO> {
		const user = await this.userService.getByEmail(credentials.email);

		if (!user) throw new UnauthorizedError();

		const isValidUser = await this.userService.isValidUser(credentials.password, user.password);

		if (!isValidUser) throw new UnauthorizedError();

		return this.generateToken(user);
	}

	async signup(credentials: CredentialsDTO): Promise<AccessTokenDTO> {
		const user = await this.userService.createUser(credentials);
		return this.generateToken(user);
	}

	private generateToken(user: User): AccessTokenDTO {
		const payload = { sub: user.email, role: user.role };
		return { accessToken: this.jwtService.sign(payload) };
	}
}
