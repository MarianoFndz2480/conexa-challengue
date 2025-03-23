import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthFacade } from './facades/auth.facade';
import { AccessTokenDTO, CredentialsDto } from './dtos/auth.dto';
import { UnauthorizedError } from './errors/auth.errors';
import { UserAlreadyExistsError } from './errors/user.errors';

@Controller()
export class AuthController {
	constructor(private readonly authFacade: AuthFacade) {}

	@Post('/login')
	async login(@Body() inputUser: CredentialsDto): Promise<AccessTokenDTO> {
		try {
			const result = await this.authFacade.login(inputUser);
			return result;
		} catch (error) {
			if (error instanceof UnauthorizedError) throw new UnauthorizedException();
			throw error;
		}
	}

	@Post('/signup')
	async signup(@Body() inputUser: CredentialsDto): Promise<AccessTokenDTO> {
		try {
			const result = await this.authFacade.signup(inputUser);
			return result;
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) throw new ConflictException();
			throw error;
		}
	}
}
