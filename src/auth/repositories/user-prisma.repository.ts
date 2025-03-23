import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';

@Injectable()
export class UserPrismaRepository implements UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(inputUser: CreateUserDto): Promise<User> {
		try {
			const prismaUser = await this.prisma.user.create({
				data: inputUser,
			});
			return { ...prismaUser, role: prismaUser.role as Role };
		} catch (error) {
			throw new Error(
				`Unexpected error when creating user: ${error instanceof Error ? error.message : 'Unexpected error'}`,
			);
		}
	}

	async getByEmail(email: string): Promise<User | null> {
		try {
			const prismaUser = await this.prisma.user.findUnique({
				where: { email },
			});
			return prismaUser ? { ...prismaUser, role: prismaUser.role as Role } : null;
		} catch (error) {
			throw new Error(
				`Unexpected error when getting user by email: ${error instanceof Error ? error.message : 'Unexpected error'}`,
			);
		}
	}
}
