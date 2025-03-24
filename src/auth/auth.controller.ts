import { Body, Controller, Post } from '@nestjs/common';
import { AuthFacade } from '@auth/facades/auth.facade';
import { AccessTokenDTO, CredentialsDTO } from '@auth/dtos/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
	ApiAuthTokenResponse,
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiUnauthorizedResponse,
} from '@common/decorators/api-responses.decorators';

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
		return this.authFacade.login(inputUser);
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
		return this.authFacade.signup(inputUser);
	}
}
