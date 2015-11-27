const stringifyStyleObject = styleObj => {
	let styles = Object.keys(styleObj).map(k =>
		k + ':' + styleObj[k]).join(';\n');
	styles = styles ? styles + ';' : '';
	return styles;
};

export default ({rule, className}) => {
	return Object.keys(rule).map(k =>
		`.${className}${k} {
			${stringifyStyleObject(rule[k])}
		}`);
};
