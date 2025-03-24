import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@app/auth/domain/repositories/user.repository';
import { HashUtil } from '@utils/hash';
import { User } from '@auth/domain/entities/user.entity';
import { UserAlreadyExistsError } from '@app/auth/domain/errors/user.error';
import { Role } from '@app/auth/domain/enums/role.enum';
import { Credentials } from '../../domain/interfaces/auth.interface';

@Injectable()
export class UserService {
	constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

	async createUser(inputUser: Credentials): Promise<User> {
		const user = await this.userRepository.getByEmail(inputUser.email);

		if (user) throw new UserAlreadyExistsError();

		const password = await HashUtil.generateHash(inputUser.password);

		return this.userRepository.create({
			...inputUser,
			password,
			role: Role.USER,
		});
	}

	getByEmail(email: string) {
		return this.userRepository.getByEmail(email);
	}

	async isValidUser(inputPassword: string, userPassword: string): Promise<boolean> {
		return HashUtil.compareHash(inputPassword, userPassword);
	}
}
