import { AN102CDecoder } from './../an102c.decoder';

test('Check Battery Low function', () => {
	expect(new AN102CDecoder('AQEADC4AZAAAAB0=').isBatteryLow()).toBe(false);
	expect(new AN102CDecoder('AQEADC4AZAQAAB0=').isBatteryLow()).toBe(true);
});

test('Check Battery Low function with differen levels', () => {
	// Level at 15%, Low Bat Flag set to 0
	expect(new AN102CDecoder('AQEADC4ADwAAAB0=').isBatteryLow()).toBe(false);
	// Level at 15%, Low Bat Flag set to 1
	expect(new AN102CDecoder('AQEADC4ADwQAAB0=').isBatteryLow()).toBe(true);
	// Level at 50%, Low Bat flag set to 0
	expect(new AN102CDecoder('AQEADC4AJAAAAB0=').isBatteryLow()).toBe(false);
	// Level at 50%, Low Bat flag set to 1
	expect(new AN102CDecoder('AQEADC4AJAQAAB0=').isBatteryLow()).toBe(true);
});

test('If isBatteryLow is undefined', () => {
	expect(new AN102CDecoder('AQIA').isBatteryLow()).toBeUndefined();
	expect(new AN102CDecoder('AQIA').isBatteryLow()).toBeFalsy();
});

test('if button is pressed functions', () => {
	// Button is pressed
	expect(new AN102CDecoder('AQIA').isButtonPressed()).toBe(true);
	// Button is not pressed
	expect(new AN102CDecoder('AQEADC4ADwAAAB0=').isButtonPressed()).toBe(false);
});

test('Check isSmokeDetected()', () => {
	expect(new AN102CDecoder('AQEADC4AJAUAAB0=').isSmokeDetected()).toBe(true);
	expect(new AN102CDecoder('AQEADC4ADwAAAB0=').isSmokeDetected()).toBe(false);
	expect(new AN102CDecoder('AQIA').isSmokeDetected()).toBeUndefined();
});

test('Check if faulty at Heartbeat frame', () => {
	expect(new AN102CDecoder('AQEADC4AJAUBAB0=').isFaulty()).toBe(true);
	expect(new AN102CDecoder('AQEADC4AJAUCAB0=').isFaulty()).toBe(true);
	// All faults
	expect(new AN102CDecoder('AQEADC4AJAUDAB0=').isFaulty()).toBe(true);
	// No faults
	expect(new AN102CDecoder('AQEADC4AJAUAAB0=').isFaulty()).toBe(false);
});

test('Check if faulty at Alarm frame', () => {
	expect(new AN102CDecoder('AQMAARAMQwBkAA==').isFaulty()).toBe(true);
	expect(new AN102CDecoder('AQMAAhAMQwBkAA==').isFaulty()).toBe(true);
	// All faults
	expect(new AN102CDecoder('AQMAAxAMQwBkAA==').isFaulty()).toBe(true);
	// No faults
	expect(new AN102CDecoder('AQMAABAMQwBkAA==').isFaulty()).toBe(false);
});

test('Check if faulty at Check frame', () => {
	expect(new AN102CDecoder('AQIB').isFaulty()).toBe(true);
	expect(new AN102CDecoder('AQKA').isFaulty()).toBe(true);
	expect(new AN102CDecoder('AQIC').isFaulty()).toBe(true);
	// Two combination of Faults
	expect(new AN102CDecoder('AQID').isFaulty()).toBe(true);
	expect(new AN102CDecoder('AQKC').isFaulty()).toBe(true);
	// All faults
	expect(new AN102CDecoder('AQKG').isFaulty()).toBe(true);
	// No faults
	expect(new AN102CDecoder('AQIA').isFaulty()).toBe(false);
});

test('Get alarm frames', () => {
	expect(new AN102CDecoder('AQIB').getAlarmType()).toMatchObject({
		name: 'AN102C',
		value: 1,
	});

	expect(new AN102CDecoder('AQMAABAMQwBkAA==').getAlarmType()).toMatchObject({
		name: 'AN102C',
		value: 1,
	});

	expect(new AN102CDecoder('AQEADC4AJAUDAB0=').getAlarmType()).toMatchObject({
		name: 'AN102C',
		value: 1,
	});
});
