export default Manager => {

	let isCached, className;

	Manager.pre('insertRule', function(next, rule) {
		const isCached = this.getCachedRule(rule.hash);
		next();
		return rule.getComposedClassName();
	});

};
