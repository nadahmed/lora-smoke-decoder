import { AutoDecodeError } from './autoDecoder.error';
import { AN102CDecoder } from './an102c.decoder';
import { JDSD51Decoder } from './jdsd51.decoder';
import * as _ from 'lodash';

export class AutoDecoder {
	public alarm!: JDSD51Decoder | AN102CDecoder | Error | undefined;

	public name!: string;

	constructor(base64Data: string) {
		const alarms = [_.attempt(() => new JDSD51Decoder(base64Data)), _.attempt(() => new AN102CDecoder(base64Data))];

		this.alarm = alarms.find((err) => {
			return !_.isError(err);
		});

		if (_.isUndefined(this.alarm)) {
			throw new AutoDecodeError();
		} else {
			this.name = this.alarm.constructor.name;
		}
	}
}
