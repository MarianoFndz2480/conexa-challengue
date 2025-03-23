import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthFacade } from './facades/auth.facade';
import { AccessTokenDTO, CredentialsDTO } from './dtos/auth.dto';
import { UnauthorizedError } from './errors/auth.errors';
import { UserAlreadyExistsError } from './errors/user.errors';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
	ApiAuthTokenResponse,
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiUnauthorizedResponse,
} from '../decorators/api-responses.decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authFacade: AuthFacade) {}

	@ApiOperation({ summary: 'User login' })
	@ApiAuthTokenResponse()
	@ApiBadRequestResponse()
	@ApiUnauthorizedResponse()
	@ApiInternalServerErrorResponse()
	@Post('login')
	async login(@Body() inputUser: CredentialsDTO): Promise<AccessTokenDTO> {
		try {
			const result = await this.authFacade.login(inputUser);
			return result;
		} catch (error) {
			if (error instanceof UnauthorizedError) throw new UnauthorizedException();
			throw error;
		}
	}

	@ApiOperation({ summary: 'User registration' })
	@ApiAuthTokenResponse()
	@ApiBadRequestResponse()
	@ApiUnauthorizedResponse()
	@ApiInternalServerErrorResponse()
	@ApiResponse({
		status: 409,
		description: 'User already exists',
		schema: {
			example: {
				message: 'Conflict',
				statusCode: 409,
			},
		},
	})
	@Post('register')
	async signup(@Body() inputUser: CredentialsDTO): Promise<AccessTokenDTO> {
		try {
			const result = await this.authFacade.signup(inputUser);
			return result;
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) throw new ConflictException();
			throw error;
		}
	}
}
