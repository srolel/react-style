export default styleSheet => {

	let toCompose;

	styleSheet.pre('insertRule', function(next, sel, rule) {
		const composes = rule[':composes'];
		if (composes) {
			delete rule[':composes'];
			toCompose = this.getRule(composes);
		} else {
			toCompose = null;
		}
		next();
	});

	styleSheet.post('insertRule', function(next, sel, rule) {
		if (toCompose) {
			this.getRule(-1).compose(toCompose);
		}
		next();
	});
};
