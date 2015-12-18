import appendCssRuleToDom from './append-css-rule-to-dom';
import stringifyRule from './stringify-style';
import {objectHash, extend} from './utils';

export default class Rule {
    constructor(sel, rule ,pos = -1) {
        let className;
        if (this.verbatim) {
            className = sel.replace('.', '');
        } else {
            const hash = objectHash(rule);
            className = `c${hash}-${sel}`;
        }

        extend(this, {rule, pos, sel, className})
    }

    stringify() {
        if (!this._parsed) {
            this._parsed = this.parse(parser);
        }
        console.log(this._parsed)
        return stringifyRule(this._parsed);
    }

    parse(parser) {
        const ruleToParse = {[this.className]: this.rule};
        this._parsed = parser ? parser(ruleToParse) : ruleToParse;
        this.numRules = Object.keys(this._parsed).length;
    }

    appendTo(sheet, parser) {
        const cssString = this.stringify();
        appendCssRuleToDom(sheet, cssString);
    }
}
