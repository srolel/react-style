export default rules => {
	if (typeof __transform_react_styles !== 'undefined') {
		__transform_react_styles(rules.map(r => [r.sel, r.className]));
	}
};
