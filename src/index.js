import createStylesheet from './stylesheet-api/create-stylesheet.js';
import getStylesheetManager, {stylesheetManagerCache} from './stylesheet-manager/get-stylesheet-manager';
import reactribute from 'reactribute';
import transformClassname from './transform-classname';
import transformStyle from './transform-style';

const checkOpts = opts => {
	if (opts.media) {
		opts.media = opts.media.replace(/^@media /, '');
	}
	return opts;
};

const compose = (...fns) => arg => fns.reduce((result, fn) => fn(result), arg);

// possible opts: {media, scope, global, renderServerStyles}

const getStylesAndClassNames = styleObj => {
	const classNames = [], styles = {};
	for (let key in styleObj) {
		const value = styleObj[key];
		if (typeof value === 'string') {
			classNames.push({
				sel: key,
				className: value
			});
		} else {
			styles[key] = value;
		}
	}
	return {classNames, styles};
};

const reactStyles = (styleObj, opts = {}) => {


	opts = {...reactStyles.opts, ...checkOpts(opts)};
	const {styles, classNames} = getStylesAndClassNames(styleObj);

	const stylesheetManager = getStylesheetManager(opts);
	const stylesheet = createStylesheet(styles, opts);
	stylesheet.addRules(styles);

	const rules = stylesheet.rules
		.map(rule => ({
			hash: rule.hash,
			sel: rule.sel,
			className: stylesheetManager.insertRule(rule)
		}))
		.concat(classNames);

	// use experimental babel plugin to replace calls to reactStyles with the resulting classNames.
	if (opts.renderServerStyles) {
		return rules;
	}

	const transform = reactribute(rules.map(r => ({
		matcher: ({key, type, props}) => {
			return r.sel === type
				|| props.className && props.className.split(' ').indexOf(r.sel) > -1;
		},
		fn({props}) {
			// add to DOM here, where we know we are rendering it
			if (r.hash) {
				stylesheetManager.appendToDOM(r.hash);
			}
			const className = props.className || '';
			props = {...props, className: `${className} ${r.className}`.trim()};
			return {props};
		}
	})));

	const decorator = compose(transformClassname, transformStyle, transform);

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

