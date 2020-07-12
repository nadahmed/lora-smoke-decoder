import { AutoDecoder } from '../lora-smoke-decoder';
import { JDSD51Decoder, AN102CDecoder } from '../decoders';
import { DecoderError } from '../decoders/decoder.baseError';

test('Check AutoDetector instance of AN102', () => {
	expect(new AutoDecoder('AQEADC4AZAAAAB0=').alarm).toBeInstanceOf(AN102CDecoder);
	expect(new AutoDecoder('AQEADC4AZAAAAB0=').alarm).not.toBeInstanceOf(JDSD51Decoder);
});

test('Check AutoDetector instance of JDSD51', () => {
	expect(new AutoDecoder('AgAB').alarm).toBeInstanceOf(JDSD51Decoder);
	expect(new AutoDecoder('AgAB').alarm).not.toBeInstanceOf(AN102CDecoder);
});

test('Check AutoDetector to have error for no match', () => {
	expect(() => {
		return new AutoDecoder('AgAAAB').alarm;
	}).toThrowError(DecoderError);
});
