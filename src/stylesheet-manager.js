/**
 * Manages the browser stylesheet elements and server style strings
 */
export default class StylesheetManager {
	/**
	 *
	 * @param DOMStyleElement a DOM style element
	 * @param opts {append, cache, media, parser}
     */
	
	static defaultOpts = {
		append: false,
		cache: true,
		media: null,
		parser: null
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
	
	getCachedRule(id) {
		return typeof id === 'string' ? this.keyedRules[id] : id;
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
		rule = this.getCachedRule(rule);
		rule.parse(this.opts.parser);
		rule.appendTo(this.DOMStyleElement);
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