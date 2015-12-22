export default styleSheet => {
	styleSheet.hook('insertRule', function(next, sel, rule, pos) {
		const composes = rule[':composes'];
		let toCompose;
		if (composes) {
			delete rule[':composes'];
		}
		next(sel, rule, pos);
		if (composes) {
			this.getRule(-1).compose(this.getRule(composes));
		}
		return this;
	});
};
