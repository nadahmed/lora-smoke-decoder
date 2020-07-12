import { DecoderError } from '../decoder.baseError';

export class JDSD51DecodeError extends DecoderError {
	constructor(message?: string) {
		super(message);
		this.name = 'JDSD51DecodeError';
		this.message = "The data does not seem like it's comming from JD-SD51 model";
		Object.setPrototypeOf(this, JDSD51DecodeError.prototype);
	}
}
