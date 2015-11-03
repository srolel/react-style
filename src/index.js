import createStylesheet from './server-styles.js';
import reactribute from 'reactribute';
import {extend} from './utils.js';

reactribute.defaultMatcher =
  x => ({type, props}) =>
    type === x || x in props || (props.key && props.key === x);

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

export {stylesheets} from './server-styles.js';
