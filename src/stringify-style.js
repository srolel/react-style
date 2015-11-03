import hyphenateStyleName from 'hyphenate-style-name';
import getStylesheet from './stylesheet-api.js';

const pickByRegex = (obj, regex) => {
	let ret = {};
	for (let k in obj) {
		if (obj.hasOwnProperty(k) && regex.test(k)) {
			ret[k] = obj[k];
		}
	}
	return ret;
};

const hyphenateStyles = styleObj => {
	let styles = Object.keys(styleObj).map(k =>
		hyphenateStyleName(k) + ':' + styleObj[k]).join(';\n');
	styles = styles ? styles + ';' : '';
	return styles;
};

const getBaseStyles = obj => pickByRegex(obj, /^[^:@]/);
const getMediaStyles = obj => pickByRegex(obj, /^@/);
const getPseudoStyles = obj => pickByRegex(obj, /^:/);

const getStyles = rule => ({
	base: getBaseStyles(rule),
	pseudo: getPseudoStyles(rule)
});

export default ({rule, className}) => {
	const {base, pseudo} = getStyles(rule);
	return `
		.${className} {
			${hyphenateStyles(base)}
		}
		${Object.keys(pseudo).map(k =>
		`.${className}${k} {
			${hyphenateStyles(pseudo[k])}
		}`
		)}
	`;
};
