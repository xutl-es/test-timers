import { describe, it, before } from '@xutl/test';
import assert from 'assert';

import * as Timer from '../';

describe('Date', () => {
	let start = Date.now();
	before(() => {
		start = Timer.update();
	});
	it(`stays the same`, async () => {
		await sleep(50);
		assert.equal(Date.now(), start);
	});
	it(`passes as it's bumped`, async () => {
		Timer.bump(12);
		assert(Date.now() > start);
	});
	it(`executes a timeout`, async () => {
		let done = 0;
		setTimeout(() => (done += 1), 10);
		await sleep(50);
		assert.equal(done, 0);
		Timer.bump(50);
		assert.equal(done, 1);
	});
	it(`executes an interval`, async () => {
		let done = 0;
		setInterval(() => (done += 1), 10);
		await sleep(50);
		assert.equal(done, 0);
		Timer.bump(50);
		assert.equal(done, 4);
	});
	it(`executes an immediate`, async () => {
		let done = 0;
		setImmediate(() => (done += 1), 10);
		await sleep(50);
		assert.equal(done, 0);
		Timer.bump(1);
		assert.equal(done, 1);
	});
});

function sleep(ms: number) {
	return new Promise((resolve) => Timer.setTimeout(resolve, ms));
}
