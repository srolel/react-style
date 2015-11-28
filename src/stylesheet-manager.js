import appendCssRuleToDom from './append-css-rule-to-dom';
/**
 * Manages the browser stylesheet elements and server style strings
 */
export default class StylesheetManager {
	/**
	 *
	 * @param DOMStyleElement a DOM style element
	 * @param stylesheet a Stylesheet instance
	 * @param opts {append, cache, media}
     */
	
	static defaultOpts = {
		append: false,
		cache: true,
		media: null
	};

	constructor(DOMStyleElement, opts) {
		this.DOMStyleElement = DOMStyleElement;
		this.opts = {...StylesheetManager.defaultOpts, ...opts};
		this.ruleLengthCache = {};
		this.rules = [];
		this.keyedRules = {};
		this.insertRule = this.insertRule.bind(this);
		this.deleteRule = this.deleteRule.bind(this);
		this.editRule = this.editRule.bind(this);
	}
	
	getRule(id) {
		return typeof id === 'string' ? this.keyedRules[id] : id;
	}

	ruleArrayToString(arr) {
		return this.wrapMedia(arr.join('\n'));
	}

	stringify(id) {
		
		if (typeof id === 'undefined') {
			return this.ruleArrayToString(this.rules);
		}
		
		const cssRules = this.getRule(id);
		return this.ruleArrayToString(cssRules);
	}

	parseRule(rule) {
		return rule.parse();
	}

	wrapMedia(styles) {
		return this.media
				? `@media ${this.media} {
					${styles}
				}`
				: styles;
	}

	// rule is a Rule object from ./style-rule.js
	insertRule(rule, opts = this.opts) {
		// save so we know what to delete if this#deleteRule is called
		const {cssRules: {length}} = this.DOMStyleElement.sheet;
		this.ruleLengthCache[rule.className] = [length, rule.numRules];
	}

	appendToDOM(rule) {
		rule = this.getRule(rule);
		rule.parse();
		rule.appendToDOM(this.DOMStyleElement);
	}

	deleteRule(key) {
		key = key.className || key;
		const [start, size] = this.ruleLengthCache[key];
		for (let i = start, end = start + size; i < end; i++) {
			this.DOMStyleElement.deleteRule(i);
		}
	}

	editRule(rule) {
		this.deleteRule(rule.className);
		this.insertRule(rule);
	}
}