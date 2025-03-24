import { User } from '@auth/domain/entities/user.entity';
import { NewUser } from '@auth/domain/interfaces/user.interface';

export interface UserRepository {
	create(inputUser: NewUser): Promise<User>;
	getByEmail(email: string): Promise<User | null>;
}
