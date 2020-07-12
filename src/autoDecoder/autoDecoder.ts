import { DecoderError } from './../decoders/decoder.baseError';
import { Decoder } from '../decoders/decoder.base';
import * as handlers from './autoDecoder.adaptor';

export class AutoDecoder extends Decoder {
	public alarm!: Decoder;

	public status: any = this.alarm?.status;

	getAlarmType = () => this.alarm?.getAlarmType();
	isBatteryLow = () => this.alarm?.isBatteryLow();
	isButtonPressed = () => this.alarm?.isButtonPressed();
	isFaulty = () => this.alarm?.isFaulty();
	isSmokeDetected = () => this.alarm?.isSmokeDetected();

	constructor(base64Data: string) {
		super(base64Data);

		for (const key in handlers) {
			if (handlers.hasOwnProperty(key)) {
				try {
					this.alarm = new (handlers as { [key: string]: any })[key](base64Data);
					return;
				} catch (e) {
					if (!(e instanceof DecoderError)) {
						throw Error(e);
					}
				}
			}
		}
		throw new DecoderError();
	}
}
