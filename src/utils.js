const isObject = x => typeof x === 'object';

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

export const pickByRegex = (obj, regex) => {
	let ret = {};
	for (let k in obj) {
		if (obj.hasOwnProperty(k) && regex.test(k)) {
			ret[k] = obj[k];
		}
	}
	return ret;
};

export const getBaseStyles = obj => pickByRegex(obj, /^[^:@]/);
export const getMediaStyles = obj => pickByRegex(obj, /^@/);
export const getPseudoStyles = obj => pickByRegex(obj, /^:/);

export const getStyles = rule => ({
	'': getBaseStyles(rule),
	...getPseudoStyles(rule)
});
