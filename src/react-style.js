import hyphenateStyleName from 'hyphenate-style-name';
import {pick, mapValues, get} from 'tr-utils';



const hash = obj => (!isObject(obj))
	? obj
	: `{
	${Object.keys(obj)
		.sort()
		.reduce((acc, k) =>
			acc.concat(`${k}:${hash(obj[k])}`)
			, [])
		.join(';')}
	}`;

const getStyleSheet = (media) => {
	const style = 
};


let stylesMap = new Map();
let mediaQueryMap = new Map();

export const resetStyles = () => {
	stylesMap = new Map();
	mediaQueryMap = new Map();
};

const hyphenateStyles = styleObj =>
	Object.keys(styleObj).map(k =>
		hyphenateStyleName(k) + ':' + styleObj[k]).join(';\n') + ';';

const getBaseStyle = styleObj => {
	return hyphenateStyles(
		pick(styleObj, (_, k) => !!k.match(/^[^:@]/))
	);
};

const getSpecialStyles = (styleObj, regex) =>
	mapValues(
		pick(styleObj, (_, k) => !!k.match(regex)),
		hyphenateStyles
	);

const getPseudoStyles = styleObj => getSpecialStyles(styleObj, /^:/);
const getMediaStyles = styleObj => pick(styleObj, (_, k) => !!k.match(/^@/));

const parseStyles = (styleObj, map, className) => {
	className = className || `c${map.size}`;

	const baseStyles = getBaseStyle(styleObj);

	const pseudoStyles = getPseudoStyles(styleObj);

	map.set((hash(styleObj)), {
		className,
		baseStyles,
		pseudoStyles
	});

	return className;
};

const addMediaQueries = (className, styleObj) => {
	const mediaStyles = getMediaStyles(styleObj);
	return Object.keys(mediaStyles).forEach(k => {
		const map = mediaQueryMap.get(k) || new Map();
		parseStyles(mediaStyles[k], map, className);
		mediaQueryMap.set(k, map);

	});
};

const addStyles = (styleObj) => {
	let className = get(stylesMap.get(hash(styleObj)), 'className');
	if (!className) {
		className = parseStyles(styleObj, stylesMap);
		addMediaQueries(className, styleObj);
	}
	return className;
};

export const styler = (...styleObjs) => {

	styleObjs = styleObjs.filter(Boolean);

	if (styleObjs.length === 0) {
		return {};
	}

	const styleObj = Object.assign({}, ...styleObjs);

	if (!styleObj || Object.keys(styleObj) === 0) {
		return {};
	}

	const className = addStyles(styleObj);
	return {className};
};

export const wrap = (elementName, content) => `<${elementName}>${content}</${elementName}>`;

const convertStyleMapToString = (map) =>
	[...map.values()].reduce((styleString, {className, baseStyles = '', pseudoStyles = ''}) =>
		styleString +
		`
		.${className} {
			${baseStyles}
		}
		${Object.keys(pseudoStyles).map(k =>
		`.${className}${k} {
			${pseudoStyles[k]}
		}`
		)}
`, '');
