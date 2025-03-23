import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { HashUtil } from '../../utils/hash';
import { User } from '../entities/user.entity';
import { CredentialsDto } from '../dtos/auth.dto';
import { UserAlreadyExistsError } from '../errors/user.errors';
import { Role } from '../enums/role.enum';

@Injectable()
export class UserService {
	constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

	async createUser(inputUser: CredentialsDto): Promise<User> {
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
