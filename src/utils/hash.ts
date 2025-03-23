import * as bcrypt from 'bcryptjs';

export class HashUtil {
	/**
	 * Hashes a password using bcryptjs
	 * @param password The password to hash
	 * @returns Promise with the hashed password
	 */
	static async generateHash(password: string): Promise<string> {
		try {
			return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);
		} catch (error) {
			throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Compares an input password with a hashed password
	 * @param inputPassword The plain text password to compare
	 * @param hashedPassword The hashed password to compare against
	 * @returns Promise with boolean indicating if passwords match
	 */
	static async compareHash(inputPassword: string, hashedPassword: string): Promise<boolean> {
		try {
			return await bcrypt.compare(inputPassword, hashedPassword);
		} catch (error) {
			throw new Error(`Failed to compare hash: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
}
