import getRule from '../rule/get-style-rule.js';
import Rule from '../rule/style-rule';
import Hooker from '../utils/hooker.js';

export class Stylesheet extends Hooker {
	constructor({media, id, ...ruleOpts} = {}) {
		super();
		this.keyedRules = {};

		this.rules = [];
		this.media = media;
		this.id = id;
		this.ruleOpts = ruleOpts;
		this.count = 0;
	}

	get length() {
		return this.rules.length;
	}

	deleteRule(id) {
		if (typeof id === 'string') {
			const {index} = this.keyedRules[id];
			delete this.keyedRules[id];
			this.rules.splice(index, 1);
		}
		return this;
	}

	removeRule(...args) {
		return this.deleteRule(...args);
	}

	insertRule(sel, rule, pos = -1) {

		const ruleObj = getRule(sel, rule, pos, this.ruleOpts);

		this.rules.push(ruleObj);
		this.keyedRules[sel] = ruleObj;
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
		if (typeof index === 'number') {
			index = index >= 0 ? index : this.length + index;
			return this.rules[index];
		}

		if (index instanceof Rule) {
			return index;
		}

		return this.keyedRules[index];
	}

	editRule(index, newRule, replace) {
		const rule = this.getRule(index);
		rule.update(newRule, replace);
		return this;
	}

	replaceRule(...args) {
		return this.editRule(...args, true);
	}
}

let numStylesheets = 0;

export default (opts) => {
	return new Stylesheet({id: numStylesheets++, ...opts});
};
