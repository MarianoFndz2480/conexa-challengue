import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export interface UserRepository {
	create(inputUser: CreateUserDto): Promise<User>;
	getByEmail(email: string): Promise<User | null>;
}
