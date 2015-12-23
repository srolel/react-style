export default Manager => {
	Manager.hook('insertRule', function(next, rule, opts) {
		const isCached = this.keyedRules[rule.hash];
		let className = next(rule, opts);
		if (isCached) {
			const cachedRule = this.keyedRules[rule.hash];
			className = cachedRule.incSpec(rule.className);
		}

		return className;
	});
};
