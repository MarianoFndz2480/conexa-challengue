import { IsEmail, IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDTO {
	@IsEmail()
	@ApiProperty({ description: 'User email', example: 'user1@example.com' })
	email: string;

	@IsString()
	@MinLength(6)
	@ApiProperty({ description: 'User password', example: 'password' })
	password: string;
}

export class AccessTokenDTO {
	@ApiProperty({ description: 'JWT token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	@Expose()
	accessToken: string;
}
