import { User } from '@auth/domain/entities/user.entity';

export type NewUser = Pick<User, 'email' | 'password' | 'role'>;
