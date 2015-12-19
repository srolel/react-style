import appendCssRuleToDom from './append-css-rule-to-dom';
import stringifyRule from './stringify-style';
import {objectHash, extend} from './utils';

export default class Rule {
    constructor(sel, rule ,pos = -1, opts = {}) {
        let className, hash, spec = 0;
        if (opts.verbatim) {
            className = sel.replace('.', '');
        } else {
            hash = opts.noHash ? '' : objectHash(rule);
            className = `c${hash}-${sel}`;
            if (opts.scope) {
                className += `-${opts.scope}`;
            }
        }

        extend(this, {rule, pos, sel, className, hash, spec});
    }

    // increase specificity and return the added specific className
    incSpec(className) {
        this.classList = this.classList || [this.className];

        if (this.classList.indexOf(className) > -1) {
            this.spec++;
            className = className + this.spec;
        }

        this.classList.push(className);

        return className;

    }

    stringify(parser) {
        if (!this._parsed) {
            this._parsed = this.parse(parser);
        }
        return stringifyRule(this._parsed);
    }

    parse(parser) {
        const className = this.classList
            ? this.className = this.classList.join(',')
            : this.className;

        const ruleToParse = {[className]: this.rule};
        this._parsed = parser ? parser(ruleToParse) : ruleToParse;
        this.numRules = Object.keys(this._parsed).length;
    }

    appendTo(sheet) {
        const cssString = this.stringify();
        this.appended = true;
        appendCssRuleToDom(sheet, cssString);
    }
}
