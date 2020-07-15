import { describe, it, before } from '@xutl/test';
import assert from 'assert';

import * as Timer from '../';

describe('Date', () => {
	let counter = 0;
	before(() => {
		const repeater = () => {
			counter += 1;
			setTimeout(repeater, 100);
		};
		repeater();
	});
	it(`100ms bump means executed 2 times`, async () => {
		Timer.bump(100);
		assert.equal(counter, 2);
	});
	it(`1000ms bump means executed 12 times`, async () => {
		Timer.bump(1000);
		assert.equal(counter, 12);
	});
});
