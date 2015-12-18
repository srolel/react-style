import EventEmitter from 'tiny-emitter';
import {extend, compose, objectHash} from './utils.js';
import Rule from './style-rule.js';

export class Stylesheet extends EventEmitter {
	constructor({media, id, verbatim} = {}) {
		super();
		this.keyedRules = {};

		this.rules = [];
		this.media = media;
		this.id = id;
		this.verbatim = verbatim;
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
		this.emit('deleteRule');
		return this;
	}

	removeRule(...args) {
		return this.deleteRule(...args);
	}

	insertRule(sel, rule, pos = -1) {

		const ruleObj = new Rule(sel, rule, pos);

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
			|| null;
	}

	editRule(index, newRule, replace) {
		const rule = this.getRule(index);
		rule.update(newRule, replace);
		this.emit('editRule', rule);
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
