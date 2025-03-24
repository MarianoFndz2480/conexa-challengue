import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiParam, ApiResponse } from '@nestjs/swagger';

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

export const ApiForbiddenResponse = () => {
	return applyDecorators(
		ApiResponse({
			status: 403,
			description: 'Forbidden',
			schema: {
				example: {
					message: 'Forbidden resource',
					statusCode: 403,
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

export const ApiUUIDParam = () => {
	return applyDecorators(
		ApiParam({
			name: 'id',
			type: 'string',
			format: 'uuid',
			example: '2978a530-1d00-4861-9858-10dd1ab32e7e',
		}),
	);
};

export const ApiMovieNotFoundResponse = () => {
	return applyDecorators(
		ApiNotFoundResponse({
			description: 'The movie has not been found.',
			schema: {
				example: {
					message: 'Not Found',
					statusCode: 404,
				},
			},
		}),
	);
};
