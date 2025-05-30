import { AdminSeeder } from './seeders/admin.seeder';
import { ConsoleLogger, Global, Module, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
	providers: [PrismaService, AdminSeeder, ConsoleLogger],
	exports: [PrismaService],
})
export class PrismaModule implements OnModuleInit {
	constructor(private readonly adminSeeder: AdminSeeder) {}

	async onModuleInit() {
		await this.adminSeeder.seed();
	}
}
