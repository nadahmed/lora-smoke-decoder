export class AN102CDecodeError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'AN102CDecodeError';
		this.message = "The data does not seem like it's comming from AN102C model";
		Object.setPrototypeOf(this, AN102CDecodeError.prototype);
	}
}
