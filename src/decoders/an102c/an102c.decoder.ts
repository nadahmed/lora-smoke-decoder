import { Decoder } from '../decoder.base';
import { AN102CDecodeError } from './an102c.error';
import { AN102Status } from '../decoder.interface';

export class AN102CDecoder extends Decoder {
	public status!: Partial<AN102Status>;

	private typeByte!: number;
	private frameByte!: number;
	private smokeDensityByte!: number;
	private temperatureBytes!: number;
	private humidityByte!: number;
	private batteryLevelByte!: number;
	private alarmByte!: number;
	private failureByte!: number;
	private opticalMazePollutionRatingByte!: number;
	private wirelessModuleVoltageByte!: number;

	constructor(base64Data: string) {
		super(base64Data);
		this.decode(this.byteArray);
	}

	public readonly isBatteryLow = () => {
		const bs = this._getAlarm();
		if (!!bs) {
			return bs.isLowBattery;
		}
	};

	public readonly isButtonPressed = () => {
		return this.status.frame?.value === 0x02;
	};

	public readonly isSmokeDetected = () => {
		const alm = this._getAlarm();
		if (!!alm) {
			return this._getAlarm()!.isSmoke;
		}
	};

	public readonly isFaulty = () => {
		const fail = this._getFailures();
		if (!!fail) {
			return fail.isDevice || fail.isTempHumid || fail.isSelfChecking;
		}
	};

	public readonly getAlarmType = () => {
		return {
			name: this.status.type!.name,
			value: this.status.type!.value,
		};
	};

	private decode(byteArray: ArrayBufferLike) {
		const data = new DataView(byteArray);

		if (data.getUint8(0) === 0x01) {
			this.typeByte = data.getUint8(0);
		} else {
			throw new AN102CDecodeError();
		}

		if (byteArray.byteLength === 11) {
			this.frameByte = data.getUint8(1);
			if (this.frameByte === 0x01) {
				this.smokeDensityByte = data.getUint8(2);
				this.temperatureBytes = data.getInt16(3, false);
				this.humidityByte = data.getUint8(5);
				this.batteryLevelByte = data.getUint8(6);
				this.alarmByte = data.getUint8(7);
				this.failureByte = data.getUint8(8);
				this.opticalMazePollutionRatingByte = data.getUint8(9);
				this.wirelessModuleVoltageByte = data.getUint8(10);
			}
		} else if (byteArray.byteLength === 3) {
			this.frameByte = data.getUint8(1);
			if (this.frameByte === 0x02) {
				this.failureByte = data.getUint8(2);
			}
		} else if (byteArray.byteLength === 10) {
			this.frameByte = data.getUint8(1);
			if (this.frameByte === 0x03) {
				this.alarmByte = data.getUint8(2);
				this.failureByte = data.getUint8(3);
				this.smokeDensityByte = data.getUint8(4);
				this.temperatureBytes = data.getInt16(5, false);
				this.humidityByte = data.getUint8(7);
				this.batteryLevelByte = data.getUint8(8);
				this.opticalMazePollutionRatingByte = data.getUint8(9);
			}
		} else {
			throw new AN102CDecodeError();
		}

		this.status = { type: { name: 'AN102C', value: this.typeByte } };

		if ((this.frameByte & 0x03) === 0x01) {
			this.status.frame = { name: 'Heart Beat', value: this.frameByte };
		} else if ((this.frameByte & 0x03) === 0x02) {
			this.status.frame = { name: 'Self Check', value: this.frameByte };
		} else if ((this.frameByte & 0x03) === 0x03) {
			this.status.frame = { name: 'Alarm', value: this.frameByte };
		} else {
			throw new AN102CDecodeError();
		}

		this.status.smokeDensity = this._getSmokeDensity();
		this.status.temperature = this._getTemperature();
		this.status.alarm = this._getAlarm();
		this.status.failure = this._getFailures();
		this.status.humidity = this._getHumidity();
		this.status.batteryLevel = this._getBatteryLevel();
		this.status.opticalMazePollutionRating = this._getOpticalMazePollutionRating();
		this.status.wirelessModuleVoltage = this._getWirelessModuleVoltageByte();
	}

	private _getSmokeDensity(): number | undefined {
		if (!!this.smokeDensityByte) {
			return this.smokeDensityByte / 100.0;
		}
	}

	private _getTemperature(): number | undefined {
		if (!!this.temperatureBytes) {
			return this.temperatureBytes / 100.0;
		}
	}

	private _getAlarm(): { isSmoke?: boolean; isHighTemp?: boolean; isLowBattery?: boolean } | undefined {
		if (this.alarmByte !== undefined) {
			return {
				isSmoke: !!(this.alarmByte & 0x01),
				isHighTemp: !!(this.alarmByte & 0x02),
				isLowBattery: !!(this.alarmByte & 0x04),
			};
		}
	}

	private _getFailures() {
		if (this.failureByte !== undefined) {
			return {
				isDevice: !!(this.failureByte & 0x01),
				isTempHumid: !!(this.failureByte & 0x02),
				isSelfChecking: !!(this.failureByte & 0x80),
			};
		}
	}

	private _getHumidity() {
		if (this.humidityByte >= 0 && this.humidityByte <= 100) {
			return this.humidityByte;
		}
	}

	private _getBatteryLevel() {
		if (this.batteryLevelByte >= 0 && this.batteryLevelByte <= 100) {
			return this.batteryLevelByte;
		}
	}

	private _getOpticalMazePollutionRating() {
		if (this.opticalMazePollutionRatingByte >= 0 && this.opticalMazePollutionRatingByte <= 100) {
			return this.opticalMazePollutionRatingByte;
		}
	}

	private _getWirelessModuleVoltageByte() {
		if (this.wirelessModuleVoltageByte !== undefined) {
			return this.wirelessModuleVoltageByte / 10.0;
		}
	}
}
