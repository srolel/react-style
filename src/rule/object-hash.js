const stringHash = str => {
	let hash = 0;
	if (str.length === 0) {
		return hash;
	}
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) - hash) + str.charCodeAt(i);
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

const sortObject = obj => {
	const sorted = Object.create(null);
	const keys = Object.keys(obj).sort();
	for (let i = 0, len = keys.length; i < len; i++) {
		const k = keys[i];
		const prop = obj[k];
		sorted[k] = typeof prop === 'object'
			? sortObject(prop)
			: prop;
	}
	return sorted;
};

export default obj => stringHash(JSON.stringify(sortObject(obj)));
