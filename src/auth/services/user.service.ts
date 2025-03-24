import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@auth/repositories/user.repository';
import { HashUtil } from '@utils/hash';
import { User } from '@auth/entities/user.entity';
import { CredentialsDTO } from '@auth/dtos/auth.dto';
import { UserAlreadyExistsError } from '@auth/errors/user.error';
import { Role } from '@auth/enums/role.enum';

@Injectable()
export class UserService {
	constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

	async createUser(inputUser: CredentialsDTO): Promise<User> {
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
