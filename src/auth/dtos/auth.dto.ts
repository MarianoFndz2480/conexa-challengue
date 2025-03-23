import { IsEmail, IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class CredentialsDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(6)
	password: string;
}

export class AccessTokenDTO {
	@Expose()
	accessToken: string;
}
