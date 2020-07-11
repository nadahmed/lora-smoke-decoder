export class DecoderError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'DecoderError';
		this.message = "The data does not seem like it's comming from any defined models";
		Object.setPrototypeOf(this, DecoderError.prototype);
	}
}
