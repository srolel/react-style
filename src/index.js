import createStylesheet from './browser-styles.js';
import reactribute from 'reactribute';
import {extend} from './utils.js';

export default styles => {
	const stylesheet = createStylesheet(styles);
	const decorator = reactribute(stylesheet.rules.map(r => ({
		matcher: r.sel,
		fn({props}) {
			return {props: extend({}, props, {className: r.className})};
		}
	})));

	return decorator;
};
