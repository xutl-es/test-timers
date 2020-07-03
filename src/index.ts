import makeHandler from './handler';

let time = globalThis.Date.now();

const Legacy = globalThis.Date;
type DateType = typeof globalThis.Date;

//@ts-ignore
const Modern: DateType = function Date(
	this: DateType,
	year?: number,
	month?: number,
	date?: number,
	hours?: number,
	minutes?: number,
	seconds?: number,
	ms?: number,
	...args: any[]
) {
	if (this && this instanceof Modern) {
		switch (arguments.length) {
			case 0:
				return new Legacy(time);
			case 1:
				return new Legacy(year ?? 0);
			case 2:
				return new Legacy(year ?? 0, month ?? 0);
			case 3:
				return new Legacy(year ?? 0, month ?? 0, date);
			case 4:
				return new Legacy(year ?? 0, month ?? 0, date, hours);
			case 5:
				return new Legacy(year ?? 0, month ?? 0, date, hours, minutes);
			case 6:
				return new Legacy(year ?? 0, month ?? 0, date, hours, minutes, seconds);
			case 7:
				return new Legacy(year ?? 0, month ?? 0, date, hours, minutes, seconds, ms);
			default:
				return new Legacy(year ?? 0, month ?? 0, date, hours, minutes, seconds, ...args);
		}
	} else {
		return `${new Legacy(time)}`;
	}
};
Modern.now = () => time;
Modern.parse = (value: string) => Legacy.parse(value);
Modern.UTC = (year: number, month: number, ...args: number[]) => Legacy.UTC(year, month, ...args);
//@ts-ignore
Modern.prototype = Legacy.prototype;
globalThis.Date = Modern;

export const Date = Legacy;

interface TimerHandlerFunction {
	(): void;
}
interface TimerType {
	start: number;
	timeout: number;
	handler: TimerHandlerFunction;
	repeat: boolean;
}
const timers = new Map<symbol, TimerType>();

//@ts-ignore
export const setTimeout = globalThis.setTimeout;
//@ts-ignore
globalThis.setTimeout = (handler: TimerHandler, timeout?: number) => {
	const id = Symbol();
	timers.set(id, {
		start: time,
		timeout: Math.max(timeout ?? 4, 4),
		handler: makeHandler(handler),
		repeat: false,
	});
	return id;
};

//@ts-ignore
export const clearTimeout = globalThis.clearTimeout;
//@ts-ignore
globalThis.clearTimeout = (spot: any) => {
	const timer = timers.get(spot as symbol);
	if (!timer || timer.repeat) return false;
	timers.delete(spot as symbol);
	return true;
};

//@ts-ignore
export const setInterval = globalThis.setInterval;
//@ts-ignore
globalThis.setInterval = (handler: TimerHandler, timeout?: number) => {
	const id = Symbol();
	timers.set(id, {
		start: time,
		timeout: Math.max(timeout ?? 4, 4),
		handler: makeHandler(handler),
		repeat: true,
	});
	return id;
};

//@ts-ignore
export const clearInterval = globalThis.clearInterval;
//@ts-ignore
globalThis.clearInterval = (spot: any) => {
	const timer = timers.get(spot as symbol);
	if (!timer || !timer.repeat || !timer.timeout) return false;
	timers.delete(spot as symbol);
	return true;
};

//@ts-ignore
export const setImmediate = globalThis.setImmediate;
//@ts-ignore
globalThis.setImmediate = (handler: TimerHandler) => {
	const id = Symbol();
	timers.set(id, {
		start: time,
		timeout: 0,
		handler: makeHandler(handler),
		repeat: false,
	});
	return id;
};

//@ts-ignore
export const clearImmediate = globalThis.clearImmediate;
//@ts-ignore
globalThis.Immediate = (spot: any) => {
	const timer = timers.get(spot as symbol);
	if (!timer || timer.repeat || timer.timeout) return false;
	timers.delete(spot as symbol);
	return true;
};

export function initialize(ms: number = Legacy.now()) {
	timers.clear();
	time = ms;
}
export function update(ms: number = Legacy.now()): number {
	const oldtime = time;
	const newtime = Math.max(ms, time);
	progressTime(oldtime, newtime);
	return time;
}
export function bump(ms: number = 0): number {
	const oldtime = time;
	const newtime = time + Math.floor(Math.abs(ms));
	progressTime(oldtime, newtime);
	return time;
}

function progressTime(oldtime: number, newtime: number) {
	for (time = oldtime; time <= newtime; time += 4) timers.forEach(runTimer);
	if (time < newtime) {
		time = newtime;
		timers.forEach(runTimer);
	}
}
function runTimer(timer: TimerType, spot: symbol) {
	const timerTime = timer.start + timer.timeout;
	if (timerTime > time) return;
	try {
		timer.handler.call(null);
	} catch (ex) {
		process.emit('uncaughtException', ex);
	}
	timer.start = time;
	if (!timer.repeat) timers.delete(spot);
}

const Default = {
	Date,
	setImmediate,
	clearImmediate,
	setTimeout,
	clearTimeout,
	setInterval,
	clearInterval,
	initialize,
	update,
	bump,
};
export default Default;
