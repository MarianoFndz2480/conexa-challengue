	import { CreateUserDto } from '@app/auth/infrastructure/dtos/user.dto';
	import { User } from '@auth/domain/entities/user.entity';
	import { userMockData } from '@auth/infrastructure/mock-data/user.mock-data';
	import { UserRepository } from '@auth/domain/repositories/user.repository';

	export class UserMockRepository implements UserRepository {
		create(inputUser: CreateUserDto): Promise<User> {
			return Promise.resolve({
				...userMockData,
				...inputUser,
			});
		}

		getByEmail(email: string): Promise<User | null> {
			const array = [userMockData];
			return Promise.resolve(array.find((a) => a.email === email) || null);
		}
	}
