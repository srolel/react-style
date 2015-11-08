import hyphenateStyleName from 'hyphenate-style-name';
import {isObject, compose} from './utils.js';

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

const getStyles = rule => ({
	'': getBaseStyles(rule),
	...getPseudoStyles(rule)
});

const hyphenate = obj => {
	const ret = {};
	for (let k in obj) {
		if (obj.hasOwnProperty(k)) {
			ret[hyphenateStyleName(k)] = isObject(obj[k])
				? hyphenate(obj[k])
				: obj[k];
		}
	}
	return ret;
};

export default compose(getStyles, hyphenate);

