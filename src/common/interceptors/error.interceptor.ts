import {
	CallHandler,
	ConflictException,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	Logger,
	NestInterceptor,
	UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { UserAlreadyExistsError } from '@app/auth/errors/user.error';
import { UnauthorizedError } from '@app/auth/errors/auth.error';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
	private readonly logger = new Logger(ErrorInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof UserAlreadyExistsError) {
					throw new ConflictException();
				}

				if (error instanceof UnauthorizedError) {
					throw new UnauthorizedException();
				}

				this.logger.error(error);

				throw new InternalServerErrorException();
			}),
		);
	}
}
