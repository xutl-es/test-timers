export default function (code: string | Function) {
	return 'string' === typeof code ? new Function(code).bind(globalThis) : code.bind(null);
}
