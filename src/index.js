import createStylesheet, {stylesheets} from './create-stylesheet.js';
import getStylesheetManager from './get-stylesheet-manager';
import reactribute from 'reactribute';
import {extend} from './utils.js';

export default (styles, opts = {}) => {

	const stylesheetManager = getStylesheetManager(opts);
	const stylesheet = createStylesheet(styles, opts);

	stylesheet
		.on('insertRule', stylesheetManager.insertRule)
		.on('editRule', stylesheetManager.editRule)
		.on('deleteRule', stylesheetManager.deleteRule);

	stylesheet.addRules(styles);

	const decorator = reactribute(stylesheet.rules.map(r => ({
		matcher: ({key, type, props}) => {
			return r.sel === key
				|| r.sel === type
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

export {stylesheets as stylesheets};

