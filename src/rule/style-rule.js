import appendCssRuleToDom from './append-css-rule-to-dom';
import stringifyRule from './stringify-style';
import objectHash from './object-hash';
import extend from 'lodash/object/assign';
import Hooker from '../utils/hooker';

export default class Rule extends Hooker {
    constructor(sel, rule ,pos = -1, opts = {}) {
        super();
        let className, hash;
        if (opts.global) {
            className = sel.replace('.', '');
        } else {
            hash = opts.noHash ? '' : objectHash(rule);
            className = `c${hash}-${sel}`;
            if (opts.scope) {
                className += `-${opts.scope}`;
            }
        }

        extend(this, {rule, pos, sel, className, hash});
    }


    stringify(parser) {
        if (!this._parsed) {
            this._parsed = this.parse(parser);
        }
        return stringifyRule(this._parsed);
    }

    getRuleToParse() {
        const className = this.classList
            ? this.className = this.classList.join(',')
            : this.className;

        const ruleToParse = {[className]: this.rule};

        return ruleToParse;

    }

    parse(parser) {
        
        const ruleToParse = this.getRuleToParse();

        this._parsed = parser ? parser(ruleToParse) : ruleToParse;
        this.numRules = Object.keys(this._parsed).length;
    }

    appendTo(sheet) {
        const cssString = this.stringify();
        this.appended = true;
        appendCssRuleToDom(sheet, cssString);
    }
}
