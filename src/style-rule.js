import stringifyRule from './stringify-style';
import {objectHash} from './utils';

export default class Rule {
    constructor(sel, rule ,pos = -1) {
        let className;
        if (this.verbatim) {
            className = sel.replace('.', '');
        } else {
            const hash = objectHash(rule);
            className = `c${hash}-${sel}`;
        }

        const numRules = Object.keys(rule).length;
        return {rule, pos, sel, className, numRules};
    }

    stringify() {
        return stringifyRule(this);
    }
}
