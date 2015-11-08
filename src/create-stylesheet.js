import detectNode from 'detect-node';
import getStylesheet from './stylesheet-api.js';

export const stylesheets = [];

const createServerStylesheet = (styles, opts) => {
	const sheet = getStylesheet(opts);
	sheet.addRules(styles);
	stylesheets.push(sheet);
	return sheet;
};

class StylesheetManager {
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
		const {rules: {length}} = this.DOMSheet;
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

const createBrowserStylesheet = (styles, opts) => {
	const styleElement = document.createElement('style');
	document.head.appendChild(styleElement);
	const sheet = styleElement.sheet;

	const stylesheet = getStylesheet(opts);

	const stylesheetManager = new StylesheetManager(sheet, stylesheet);

	stylesheet
		.on('insertRule', stylesheetManager.insertRule)
		.on('editRule', stylesheetManager.editRule)
		.on('deleteRule', stylesheetManager.deleteRule);

	stylesheet.addRules(styles);

	return stylesheet;
};

export default (...args) => detectNode
	? createServerStylesheet(...args)
	: createBrowserStylesheet(...args);
