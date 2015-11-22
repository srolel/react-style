import createStylesheet from './create-stylesheet.js';
import reactribute from 'reactribute';
import {extend} from './utils.js';

export default (styles, opts = {}) => {

	const stylesheet = createStylesheet(styles, opts);

	const decorator = reactribute(stylesheet.rules.map(r => ({
		matcher: ({key, type, props}) => {
			return r.sel === key
				|| r.sel === type
				|| props.className && props.className.split(' ').indexOf(r.sel) > -1;
		},
		fn({props}) {
			const className = props.className || '';
			return {props: extend({}, props, {className: `${className} ${r.className}`.trim()})};
		}
	})));

	decorator.stylesheet = stylesheet;
	return decorator;
};

export {stylesheets} from './create-stylesheet.js';

