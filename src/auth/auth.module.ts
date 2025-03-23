import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthFacade } from './facades/auth.facade';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserPrismaRepository } from './repositories/user-prisma.repository';

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
	providers: [AuthFacade, UserService, { provide: 'UserRepository', useClass: UserPrismaRepository }],
	exports: [],
})
export class AuthModule {}
