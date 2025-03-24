import {
	BadRequestException,
	CallHandler,
	ConflictException,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	Logger,
	NestInterceptor,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { UserAlreadyExistsError } from '@app/auth/domain/errors/user.error';
import { UnauthorizedError } from '@app/auth/domain/errors/auth.error';
import { MovieAlreadyExistsError, MovieNotFoundError } from '../../movies/domain/errors/movie.error';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
	private readonly logger = new Logger(ErrorInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof UserAlreadyExistsError || error instanceof MovieAlreadyExistsError) {
					throw new ConflictException();
				}

				if (error instanceof UnauthorizedError) {
					throw new UnauthorizedException();
				}

				if (error instanceof MovieNotFoundError) {
					throw new NotFoundException();
				}

				if (error instanceof BadRequestException) {
					throw error;
				}

				this.logger.error(error);

				throw new InternalServerErrorException();
			}),
		);
	}
}
