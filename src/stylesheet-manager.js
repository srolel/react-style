export default class StylesheetManager {
	constructor(DOMSheet, stylesheet) {
		this.DOMSheet = DOMSheet;
		this.stylesheet = stylesheet;
		this.cache = {};
		this.insertRule = this.insertRule.bind(this);
		this.deleteRule = this.deleteRule.bind(this);
		this.editRule = this.editRule.bind(this);
	}

	insertRule(rule) {
		const cssRules = this.stylesheet.getCSSRules(rule);
		const {cssRules: {length}} = this.DOMSheet;
		this.cache[rule.className] = [length, rule.numRules];
		cssRules.forEach(r => this.DOMSheet.insertRule(r, length));
	}

	deleteRule(key) {
		key = key.className || key;
		const [start, size] = this.cache[key];
		for (let i = start, end = start + size; i < end; i++) {
			this.DOMSheet.deleteRule(i);
		}
	}

	editRule(rule) {
		this.deleteRule(rule.className);
		this.insertRule(rule);
	}
}