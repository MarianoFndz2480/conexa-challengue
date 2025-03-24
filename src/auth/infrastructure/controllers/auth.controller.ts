import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthFacade } from '@app/auth/application/facades/auth.facade';
import { AccessTokenDTO, CredentialsDTO } from '@app/auth/infrastructure/dtos/auth.dto';
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
	@HttpCode(HttpStatus.OK)
	@ApiAuthTokenResponse()
	@ApiBadRequestResponse()
	@ApiUnauthorizedResponse()
	@ApiInternalServerErrorResponse()
	@Post('login')
	async login(@Body() inputUser: CredentialsDTO): Promise<AccessTokenDTO> {
		return this.authFacade.login(inputUser);
	}

	@ApiOperation({ summary: 'User registration' })
	@HttpCode(HttpStatus.CREATED)
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
	@Post('signup')
	async signup(@Body() inputUser: CredentialsDTO): Promise<AccessTokenDTO> {
		return this.authFacade.signup(inputUser);
	}
}
