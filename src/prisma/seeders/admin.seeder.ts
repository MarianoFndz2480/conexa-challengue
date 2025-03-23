import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HashUtil } from '../../utils/hash';
import { Role } from '../../auth/enums/role.enum';

@Injectable()
export class AdminSeeder {
	constructor(private readonly prisma: PrismaService) {}

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
			console.log('Admin user created successfully');
		} else {
			console.log('Admin user already exists');
		}
	}
}
