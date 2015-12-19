/**
 * Manages the browser stylesheet elements and server style strings
 */
export default class StylesheetManager {

	static defaultOpts = {
		append: false,
		cache: true,
		media: null,
		parser: null
	};

	/**
	 * @param DOMStyleElement a DOM style element
	 * @param opts {append, cache, media, parser}
     */

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
		return typeof id === 'object' ? id : this.keyedRules[id];
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
		this.rules.push(rule);
		this.ruleLengthCache[rule.className] = [length, rule.numRules];

		const cachedRule = this.getCachedRule(rule.hash);

		let className;
		if (cachedRule) {
			className = cachedRule.incSpec(rule.className);
		} else {
			this.keyedRules[rule.hash] = rule;
			className = rule.className;
		}

		return className;
	}

	appendToDOM(rule) {
		rule = this.getCachedRule(rule);
		if (!rule.appended) {
			rule.parse(this.opts.parser);
			rule.appendTo(this.DOMStyleElement);
		}
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
