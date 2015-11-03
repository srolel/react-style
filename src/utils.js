export const extend = (...objs) => {
	let ret = objs.shift();
	while (objs.length > 0) {
		const obj = objs.pop();
		for (var k in obj) {
			if (!(k in ret) && obj.hasOwnProperty(k)) {
				ret[k] = obj[k];
			}
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
