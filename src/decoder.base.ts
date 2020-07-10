import { JDSD51Status, AN102Status } from './decoder.interface';

export abstract class Decoder {
	public readonly base64Data: string;
	public readonly byteArray: ArrayBufferLike;

	constructor(base64Data: string) {
		this.base64Data = base64Data;
		this.byteArray = this.base64decode(base64Data);
	}

	public base64decode(base64: string): ArrayBufferLike {
		const binaryString = Buffer.from(base64, 'base64').toString();
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}

	public toBinaryString() {
		const data = new DataView(this.byteArray);
		let bstring = '';
		for (let i = 0; i < this.byteArray.byteLength; i++) {
			bstring += ('00000000' + data.getUint8(i).toString(2)).slice(-8) + ' ';
		}
		return bstring;
	}
	public abstract readonly status: Partial<any>;
	public abstract readonly getAlarmType: () => { name?: string; value?: number } | undefined;
	public abstract readonly isSmokeDetected: () => boolean | undefined;
	public abstract readonly isButtonPressed: () => boolean | undefined;
	public abstract readonly isFaulty: () => boolean | undefined;
	public abstract readonly isBatteryLow: () => boolean | undefined;
}
