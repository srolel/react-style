import createStylesheet from './create-stylesheet.js';
import getStylesheetManager, {stylesheetManagerCache} from './get-stylesheet-manager';
import reactribute from 'reactribute';

const checkOpts = opts => {
	if (opts.media) {
		opts.media = opts.media.replace(/^@media /, '');
	}
	return opts;
};

// possible opts: {media, scope, verbatim}

const reactStyles = (styles, opts = {}) => {

	opts = {...reactStyles.opts, ...checkOpts(opts)};

	const stylesheetManager = getStylesheetManager(opts);
	const stylesheet = createStylesheet(styles, opts);

	const rules = [];

	stylesheet
		.on('insertRule', rule =>
			rules.push({
				hash: rule.hash,
				sel: rule.sel,
				className: stylesheetManager.insertRule(rule)
			})
		);

	stylesheet.addRules(styles);

	const decorator = reactribute(rules.map(r => ({
		matcher: ({key, type, props}) => {
			return r.sel === type
				|| props.className && props.className.split(' ').indexOf(r.sel) > -1;
		},
		fn({props}) {
			// add to DOM here, where we know we are rendering it
			stylesheetManager.appendToDOM(r.hash);
			const className = props.className || '';
			props = {...props, className: `${className} ${r.className}`.trim()};
			return {props};
		}
	})));

	decorator.stylesheet = stylesheet;
	decorator.stylesheetManager = stylesheetManager;
	return decorator;
};

reactStyles.config = opts => reactStyles.opts = opts;

reactStyles.getSheetsAsString = () =>
	Object.keys(stylesheetManagerCache)
		.map(media =>
			stylesheetManagerCache[media].DOMStyleElement.outerHTML)
		.join('');

reactStyles.create = instanceOpts =>
	(styles, opts) =>
		reactStyles(styles, {...instanceOpts, ...opts});

export default reactStyles;

export {stylesheetManagerCache as stylesheets};

