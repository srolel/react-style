import hyphenateStyleName from 'hyphenate-style-name';

const stringifyStyleObject = styleObj => {

	let styles = Object.keys(styleObj)
		.map(k => hyphenateStyleName(k) + ':' + styleObj[k])
		.join(';');

	styles = styles ? styles + ';' : '';
	return styles;
};

const isMedia = str => str.indexOf('@') === 0;

const stringifyStyle = rule =>
	Object.keys(rule).map(k =>
		`${k} {
			${isMedia(k)
				? stringifyStyle(rule[k])
				: stringifyStyleObject(rule[k])}
		}`).join('');

export default stringifyStyle;
