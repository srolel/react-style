import createStylesheet from './stylesheet-api/create-stylesheet.js';
import getStylesheetManager, {stylesheetManagerCache} from './stylesheet-manager/get-stylesheet-manager';
import reactribute from 'reactribute';
import serverSideRenderTransform from './utils/server-side-render-transform.js';

const checkOpts = opts => {
	if (opts.media) {
		opts.media = opts.media.replace(/^@media /, '');
	}
	return opts;
};

// possible opts: {media, scope, global}

const reactStyles = (styles, opts = {}) => {


	opts = {...reactStyles.opts, ...checkOpts(opts)};

	const stylesheetManager = getStylesheetManager(opts);
	const stylesheet = createStylesheet(styles, opts);

	stylesheet.addRules(styles);

	const rules = stylesheet.rules.map(rule => ({
		hash: rule.hash,
		sel: rule.sel,
		className: stylesheetManager.insertRule(rule)
	}));

	// use experimental babel plugin to replace calls to reactStyles with the resulting classNames.
	if (opts.renderServerStyles) {
		serverSideRenderTransform(rules);
	}

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

// for server-side rendering etc.
reactStyles.getSheetsAsString = () =>
	Object.keys(stylesheetManagerCache)
		.map(media =>
			stylesheetManagerCache[media].DOMStyleElement.outerHTML)
		.join('');

// options mixin
reactStyles.create = instanceOpts =>
	(styles, opts) =>
		reactStyles(styles, {...instanceOpts, ...opts});

export default reactStyles;

export {stylesheetManagerCache as stylesheets};

