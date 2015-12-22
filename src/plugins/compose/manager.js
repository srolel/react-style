export default Manager => {

	let isCached, className;

	Manager.hook('insertRule', function(next, rule, opts) {
		const isCached = this.getCachedRule(rule.hash);
		next(rule, opts);
		return rule.getComposedClassName();
	});

};
