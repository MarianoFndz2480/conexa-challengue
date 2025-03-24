export class MovieAlreadyExistsError extends Error {
	constructor() {
		super();
		this.name = this.constructor.name;
	}
}

export class MovieNotFoundError extends Error {
	constructor() {
		super();
		this.name = this.constructor.name;
	}
}
