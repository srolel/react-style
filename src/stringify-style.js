import hyphenateStyleName from 'hyphenate-style-name';

const hyphenateStyles = styleObj => {
	let styles = Object.keys(styleObj).map(k =>
		hyphenateStyleName(k) + ':' + styleObj[k]).join(';\n');
	styles = styles ? styles + ';' : '';
	return styles;
};

export default ({rule, className}) => {
	return Object.keys(rule).map(k =>
		`.${className}${k} {
			${hyphenateStyles(rule[k])}
		}`);
};
