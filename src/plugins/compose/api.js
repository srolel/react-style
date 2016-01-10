export default styleSheet => {
	styleSheet.hook('insertRule', function(next, sel, rule, pos) {
		const composes = rule[':composes'];
		if (composes) {
			delete rule[':composes'];
		}
		next(sel, rule, pos);
		if (composes) {
			// if it's a string, look for a rule by that name in the current stylesheet
			const toCompose = typeof composes === 'string'
				? this.getRule(composes)
				: composes;
			this.getRule(-1).compose(toCompose);
		}
		return this;
	});
};
