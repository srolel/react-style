import EventEmitter from 'tiny-emitter';
import stringifyStyle from './stringify-style.js';
import {extend, getStyles} from './utils.js';

export class Stylesheet extends EventEmitter {
	constructor({media, isGlobal, id} = {}) {
		super();
		this.keyedRules = {};
		this.rules = [];
		this.media = media;
		this.id = id;
		this.count = 0;
	}

	get length() {
		return this.rules.length;
	}

	stringify(id) {
		return this.getCSSRules(id).join('\n');
	}

	getCSSRules(id) {
		if (typeof id === 'undefined') {
			return this.rules.map(r => this.stringify(r)).reduce((a, b) => a.concat(b));
		}

		const rule = typeof id === 'string'
			? this.getRule(id)
			: id;

		return stringifyStyle(rule);
	}

	isSelector(index) {
		return typeof index === 'string';
	}

	deleteRule(id) {
		if (this.isSelector(id)) {
			const {index} = this.keyedRules[id];
			delete this.keyedRules[id];
			this.rules.splice(index, 1);
		}
		this.emit('deleteRule');
		return this;
	}

	removeRule(...args) {
		return this.deleteRule(...args);
	}

	insertRule(sel, rule, pos = -1) {
		const className = `c${this.id}-${this.count++}`;
		rule = getStyles(rule);
		const ruleObj = {rule, pos, sel, className};

		this.rules.push(ruleObj);
		this.keyedRules[sel] = ruleObj;

		this.emit('insertRule', ruleObj);
		return this;
	}

	insertRules(rules) {
		for (var k in rules) {
			if (rules.hasOwnProperty(k)) {
				this.insertRule(k, rules[k]);
			}
		}
		return this;
	}

	addRule(...args) {
		return this.insertRule(...args);
	}

	addRules(...args) {
		return this.insertRules(...args);
	}

	getRule(index) {
		return this.keyedRules[index]
			|| this.indexedRules[index]
			|| null;
	}

	editRule(index, newRule, replace) {
		const rule = this.getRule(index);

		if (!rule) {
			throw new Error('trying to edit non-existing rule.');
		}

		newRule = getStyles(newRule);

		if (replace) {
			this.keyedRules[index].rule = newRule;
		} else {
			extend(rule.rule, newRule);
		}

		this.emit('editRule');
		return this;
	}

	replaceRule(...args) {
		return this.editRule(...args, true);
	}
}

let numStylesheets = 0;

export default () => {
	return new Stylesheet({id: numStylesheets++});
};
