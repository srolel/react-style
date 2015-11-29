import createStylesheet from './create-stylesheet.js';
import getStylesheetManager, {stylesheetManagerCache} from './get-stylesheet-manager';
import reactribute from 'reactribute';
import {extend} from './utils.js';

const checkOpts = opts => {
	opts.media = opts.media.replace(/^@media /, '');
}

const reactStyles = (styles, opts = {}) => {

	checkOpts(opts);

	opts = {...reactStyles.opts, ...opts};

	const stylesheetManager = getStylesheetManager(opts);
	const stylesheet = createStylesheet(styles, opts);

	stylesheet
		.on('insertRule', stylesheetManager.insertRule)
		.on('editRule', stylesheetManager.editRule)
		.on('deleteRule', stylesheetManager.deleteRule);

	stylesheet.addRules(styles);

	const decorator = reactribute(stylesheet.rules.map(r => ({
		matcher: ({key, type, props}) => {
			return r.sel === type
				|| props.className && props.className.split(' ').indexOf(r.sel) > -1;
		},
		fn({props}) {
			// add to DOM here, where we know we are rendering it
			stylesheetManager.appendToDOM(r);
			const className = props.className || '';
			return {props: extend({}, props, {className: `${className} ${r.className}`.trim()})};
		}
	})));

	decorator.stylesheet = stylesheet;
	return decorator;
};

reactStyles.config = opts => reactStyles.opts = opts;

reactStyles.getSheetsAsString = () =>
	Object.keys(stylesheetManagerCache)
		.map(media =>
			stylesheetManagerCache[media].DOMStyleElement.outerHTML)
		.join('');

export default reactStyles;

export {stylesheetManagerCache as stylesheets};

