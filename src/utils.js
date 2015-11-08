export const isObject = x => typeof x === 'object';

export const extend = (...objs) => {
	let ret = objs.shift(), firstRun = true;
	while (objs.length > 0) {
		const obj = objs.pop();
		for (var k in obj) {
			if ((firstRun || !(k in ret)) && obj.hasOwnProperty(k)) {
				const objProp = obj[k];
				const retProp = ret[k];
				if (isObject(objProp) && isObject(retProp)) {
					extend(ret[k], obj[k]);
				} else {
					ret[k] = obj[k];
				}
			}
			firstRun = false;
		}
	}
	return ret;
};

export const hash = obj => (!isObject(obj))
	? obj
	: `{
	${Object.keys(obj)
		.sort()
		.reduce((acc, k) =>
			acc.concat(`${k}:${hash(obj[k])}`)
			, [])
		.join(';')}
	}`;


export const compose = (...fns) => {
	const firstFn = fns[0];
	fns = fns.slice(1);
	return (...args) => {
		const firstResult = firstFn(...args);
		return fns.reduce((acc, fn) => fn(acc), firstResult);
	};
};
