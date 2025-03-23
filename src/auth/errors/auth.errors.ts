export class UnauthorizedError extends Error {
	constructor() {
		super();
		this.name = this.constructor.name;
	}
}
