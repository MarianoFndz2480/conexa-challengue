import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@auth/domain/enums/role.enum';
import { ROLES_KEY } from '@common/decorators/roles.decorator';

interface RequestWithUser extends Request {
	user: {
		email: string;
		role: Role;
	};
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) {
			return true;
		}

		const request = context.switchToHttp().getRequest<RequestWithUser>();

		return requiredRoles.includes(request.user?.role);
	}
}
