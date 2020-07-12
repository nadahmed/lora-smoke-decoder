import { JDSD51Status, AN102Status } from './decoder.interface';

export abstract class Decoder implements DecoderBaseMethods {
	public readonly base64Data: string;
	public readonly byteArray: ArrayBufferLike;

	protected constructor(base64Data: string) {
		this.base64Data = base64Data;
		this.byteArray = this.base64decode(base64Data);
	}

	protected base64decode(base64: string): ArrayBufferLike {
		const binaryString = Buffer.from(base64, 'base64').toString();
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}

	protected toBinaryString() {
		const data = new DataView(this.byteArray);
		let bstring = '';
		for (let i = 0; i < this.byteArray.byteLength; i++) {
			bstring += ('00000000' + data.getUint8(i).toString(2)).slice(-8) + ' ';
		}
		return bstring;
	}

	public abstract status: any;
	public abstract getAlarmType(): { name?: string; value?: number } | undefined;
	public abstract isSmokeDetected(): boolean | undefined;
	public abstract isButtonPressed(): boolean | undefined;
	public abstract isFaulty(): boolean | undefined;
	public abstract isBatteryLow(): boolean | undefined;
	// public abstract readonly getAlarmType: () => { name?: string; value?: number } | undefined;
	// public abstract readonly isSmokeDetected: () => boolean | undefined;
	// public abstract readonly isButtonPressed: () => boolean | undefined;
	// public abstract readonly isFaulty: () => boolean | undefined;
	// public abstract readonly isBatteryLow: () => boolean | undefined;
}

interface DecoderBaseMethods {
	getAlarmType(): { name?: string; value?: number } | undefined;
	isSmokeDetected(): boolean | undefined;
	isButtonPressed(): boolean | undefined;
	isFaulty(): boolean | undefined;
	isBatteryLow(): boolean | undefined;
}
