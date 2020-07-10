export class AutoDecodeError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'AutoDecodeError';
		this.message = 'AutoDecoder could not find the Alarm for the given data.';
		Object.setPrototypeOf(this, AutoDecodeError.prototype);
	}
}
