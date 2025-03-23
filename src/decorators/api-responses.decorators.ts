import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiUnauthorizedResponse = () => {
	return applyDecorators(
		ApiResponse({
			status: 401,
			description: 'Unauthorized',
			schema: {
				example: {
					message: 'Unauthorized',
					statusCode: 401,
				},
			},
		}),
	);
};

export const ApiBadRequestResponse = () => {
	return applyDecorators(
		ApiResponse({
			status: 400,
			description: 'Bad request',
			schema: {
				example: {
					message: ['property must be an string'],
					error: 'Bad Request',
					statusCode: 400,
				},
			},
		}),
	);
};

export const ApiAuthTokenResponse = () => {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Returns JWT token',
			schema: {
				example: {
					access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
				},
			},
		}),
	);
};

export const ApiInternalServerErrorResponse = () => {
	return applyDecorators(
		ApiResponse({
			status: 500,
			description: 'Internal server error',
			schema: {
				example: {
					message: 'Internal server error',
					statusCode: 500,
				},
			},
		}),
	);
};
