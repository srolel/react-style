export const isObject = x => typeof x === 'object';

export const extend = (...objects) => {
	let ret = objects.shift(), firstRun = true;
	while (objects.length > 0) {
		const obj = objects.pop();
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


const stringHash = str => {
	var hash = 0;
	if (str.length === 0) {
		return hash;
	}
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) - hash) + str.charCodeAt(i);
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

export const objectHash = obj => stringHash(JSON.stringify(obj));