import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { userMockData } from '../mock-data/user.mock-data';
import { UserRepository } from './user.repository';

export class UserMockRepository implements UserRepository {
	create(inputUser: CreateUserDto): Promise<User> {
		return Promise.resolve({
			...userMockData,
			...inputUser,
		});
	}

	getByEmail(email: string): Promise<User> {
		const array = [userMockData];
		return Promise.resolve(array.find((a) => a.email === email));
	}
}
