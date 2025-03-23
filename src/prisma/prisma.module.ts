import { Global, Module, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AdminSeeder } from './seeders/admin.seeder';

@Global()
@Module({
	providers: [PrismaService, AdminSeeder],
	exports: [PrismaService],
})
export class PrismaModule implements OnModuleInit {
	constructor(private readonly adminSeeder: AdminSeeder) {}

	async onModuleInit() {
		await this.adminSeeder.seed();
	}
}
