import hyphenateStyleName from 'hyphenate-style-name';

const hyphenate = ruleName => style => hyphenateStyleName(ruleName) + ':' + style;

const stringifyStyleWithArray = (ruleName, styles) => {
	const hyphenateRule = hyphenate(ruleName);

	if (!Array.isArray(styles)) {
		return hyphenateRule(styles) + ';';
	}

	let ret = '';
	const keys = Object.keys(styles);
	for (let i = 0, len = keys.length; i < len; i++) {
		const k = keys[i];
		ret += hyphenateRule(styles[k]) + ';';
	}

	return ret;
};

const stringifyStyleObject = styles => {
	const keys = Object.keys(styles);
	let ret = '';
	for (let i = 0, len = keys.length; i < len; i++) {
		const k = keys[i];
		ret += stringifyStyleWithArray(k, styles[k]);
	}
	return ret;
};

const isMedia = str => str.indexOf('@') === 0;

const addClassDot = k => k.split(/,\s*/).map(x => '.' + x).join(',');

const stringifyStyle = rule => {
	const keys = Object.keys(rule);
	let ret = '';
	for (let i = 0, len = keys.length; i < len; i++) {
		const k = keys[i];
		ret += `${addClassDot(k)} {
			${isMedia(k)
				? stringifyStyle(rule[k])
				: stringifyStyleObject(rule[k])}
		}`;
	}
	return ret;
};

export default stringifyStyle;
