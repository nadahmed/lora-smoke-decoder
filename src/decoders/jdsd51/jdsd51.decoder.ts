import { Decoder } from '../decoder.base';
import { JDSD51DecodeError } from './jdsd51.error';
import { JDSD51Status, ButtonStatus } from '../decoder.interface';

export class JDSD51Decoder extends Decoder {
	public status!: Partial<JDSD51Status>;

	private versionByte!: number;
	private detectionTypeByte!: number;
	private statusByte!: number;

	constructor(base64Data: string) {
		super(base64Data);
		this.decode(this.byteArray);
	}

	public readonly isBatteryLow = () => {
		return this._isLowBattery();
	};

	public readonly isButtonPressed = () => {
		return this._getButtonStatus() === ButtonStatus.Test || this._getButtonStatus() === ButtonStatus.Silenced;
	};

	public readonly isSmokeDetected = () => {
		return this._isSmokeDetected();
	};

	public readonly isFaulty = () => {
		return this._isFaulty() || this._isTampered();
	};

	public readonly getAlarmType = () => {
		return {
			name: this.status.type!.name,
			value: this.status.type!.value,
		};
	};

	private _isSmokeDetected() {
		if ((this.detectionTypeByte & 0xff) === 0x04) {
			return true;
		} else if ((this.detectionTypeByte & 0xff) === 0) {
			return false;
		} else {
			throw new JDSD51DecodeError();
		}
	}

	private _isFaulty() {
		if ((this.statusByte & 0xc0) === 0x40) {
			return true;
		} else if ((this.statusByte & 0xc0) === 0) {
			return false;
		} else {
			throw new JDSD51DecodeError();
		}
	}

	private _isLowBattery() {
		if ((this.statusByte & 0x30) === 0x10) {
			return true;
		} else if ((this.statusByte & 0x30) === 0) {
			return false;
		} else {
			throw new JDSD51DecodeError();
		}
	}

	private _isTampered() {
		if ((this.statusByte & 0x08) === 0x08) {
			return true;
		} else {
			return false;
		}
	}

	private _getButtonStatus(): ButtonStatus {
		if ((this.statusByte & 0x07) === 0x01) {
			return ButtonStatus.Test;
		} else if ((this.statusByte & 0x07) === 0x02) {
			return ButtonStatus.Silenced;
		} else if ((this.statusByte & 0x07) === 0) {
			return ButtonStatus.Normal;
		} else {
			throw new JDSD51DecodeError();
		}
	}

	private decode(byteArray: ArrayBufferLike): void {
		const data = new DataView(byteArray);

		if (byteArray.byteLength !== 3) {
			throw new JDSD51DecodeError();
		}
		this.versionByte = data.getUint8(0);
		this.detectionTypeByte = data.getUint8(1);
		this.statusByte = data.getUint8(2);

		if (this.versionByte !== 2) {
			throw new JDSD51DecodeError();
		}

		this.status = {
			type: { name: 'JDSD51', value: this.versionByte },
			isSmokeDetected: this._isSmokeDetected(),
			isFaulty: this._isFaulty(),
			isLowBattery: this._isLowBattery(),
			isTampered: this._isTampered(),
			buttonStatus: this._getButtonStatus(),
		};
	}
}
