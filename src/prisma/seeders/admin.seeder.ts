import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { HashUtil } from '@utils/hash';
import { Role } from '@auth/domain/enums/role.enum';

@Injectable()
export class AdminSeeder {
	constructor(
		private readonly prisma: PrismaService,
		private readonly logger: ConsoleLogger,
	) {
		this.logger.setContext(AdminSeeder.name);
	}

	async seed() {
		const adminExists = await this.prisma.user.findFirst({
			where: {
				email: 'admin@example.com',
				role: Role.ADMIN,
			},
		});

		if (!adminExists) {
			const password = await HashUtil.generateHash('password');

			await this.prisma.user.create({
				data: {
					email: 'admin@example.com',
					password,
					role: Role.ADMIN,
				},
			});
			this.logger.log('Admin user created successfully');
		} else {
			this.logger.log('Admin user already exists');
		}
	}
}
