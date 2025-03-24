import { Module } from '@nestjs/common';
import { AuthController } from '@app/auth/infrastructure/controllers/auth.controller';
import { AuthFacade } from '@app/auth/application/facades/auth.facade';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@app/auth/application/services/user.service';
import { PrismaModule } from '@prisma/prisma.module';
import { UserPrismaRepository } from '@app/auth/infrastructure/repositories/user-prisma.repository';
import { JwtStrategy } from '@app/auth/infrastructure/strategies/jwt.strategy';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'secret',
			signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
		}),
		PrismaModule,
	],
	controllers: [AuthController],
	providers: [AuthFacade, UserService, { provide: 'UserRepository', useClass: UserPrismaRepository }, JwtStrategy],
	exports: [],
})
export class AuthModule {}
