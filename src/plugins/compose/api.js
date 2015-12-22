export default StylesheetApi => {

	let toCompose;

	StylesheetApi.pre('insertRule', function(next, sel, rule) {
		const composes = rule[':composes'];
		if (composes) {
			delete rule[':composes'];
			toCompose = this.getRule(composes);
		} else {
			toCompose = null;
		}
		next();
	});

	StylesheetApi.post('insertRule', function(next, sel, rule) {
		if (toCompose) {
			this.getRule(-1).compose(toCompose);
		}
		next();
	});
};
