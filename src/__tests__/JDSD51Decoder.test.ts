import { JDSD51Status } from '../interfaces';
import { JDSD51Decoder,  } from '../decoders';
import { JDSD51DecodeError} from '../errors'
import { randomBytes } from 'crypto';
import { random } from 'lodash';

test('Fault is true', () => {
	expect(new JDSD51Decoder('AgBA').status.isFaulty).toBe(true);
});

test('Battery Low is true', () => {
	expect(new JDSD51Decoder('AgAQ').status.isLowBattery).toBe(true);
});

test('Tampered is true', () => {
	expect(new JDSD51Decoder('AgAI').status.isTampered).toBe(true);
});

test('All is false', () => {
	expect(new JDSD51Decoder('AgAA').status).toMatchObject({
		isFaulty: false,
		isLowBattery: false,
		isSmokeDetected: false,
		isTampered: false,
		buttonStatus: 'Normal',
	} as JDSD51Status);
});

test('Smoke detected is true', () => {
	expect(new JDSD51Decoder('AgQA').status.isSmokeDetected).toBe(true);
});

test('Smoke detected is true and Button is pressed Silence', () => {
	expect(new JDSD51Decoder('AgQC').status).toMatchObject({
		isFaulty: false,
		isLowBattery: false,
		isSmokeDetected: true,
		isTampered: false,
		buttonStatus: 'Silenced',
	} as JDSD51Status);
});

test('Alarm Type is OK', () => {
	expect(new JDSD51Decoder('AgQA').getAlarmType()).toMatchObject({ name: 'JDSD51', value: 2 } as Partial<JDSD51Status>);
});

test('Battery Low function is OK', () => {
	expect(new JDSD51Decoder('AgAQ').isBatteryLow()).toBe(true);
	expect(new JDSD51Decoder('AgAA').isBatteryLow()).toBe(false);
});

test('Button Pressed function is OK', () => {
	expect(new JDSD51Decoder('AgQC').isButtonPressed()).toBe(true);
	expect(new JDSD51Decoder('AgAB').isButtonPressed()).toBe(true);
	expect(new JDSD51Decoder('AgAA').isButtonPressed()).toBe(false);
});

test('Fault function is OK', () => {
	expect(new JDSD51Decoder('AgAI').isFaulty()).toBe(true);
	expect(new JDSD51Decoder('AgBA').isFaulty()).toBe(true);
	expect(new JDSD51Decoder('AgAA').isFaulty()).toBe(false);
});

test('Smoke detector function is OK', () => {
	expect(new JDSD51Decoder('AgQA').isSmokeDetected()).toBe(true);
	expect(new JDSD51Decoder('AgQC').isSmokeDetected()).toBe(true);
	expect(new JDSD51Decoder('AgAA').isSmokeDetected()).toBe(false);
});

test('Error Check', () => {
	for (let i = 0; i < 100; i++) {
		const byteArray = randomBytes(random(2, 4, false));
		const text = byteArray.toString('base64');
		expect(() => {
			new JDSD51Decoder(text).toBinaryString();
		}).toThrowError(JDSD51DecodeError);
	}
});
