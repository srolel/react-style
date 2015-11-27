import getStylesheet from './stylesheet-api.js';

// cache a stylesheet for each media query. Not sure if this is actually useful but it feels more organized.
const styleSheetCache = new Map();

const createBrowserStylesheet = (styles, opts) => {

	const {media} = opts;
	let styleElement;
	if (styleSheetCache.has(media)) {
		styleElement = styleSheetCache.get(media);
	} else {
		styleElement = document.createElement('style');
		if (media) {
			styleElement.media = media;
		}
		styleSheetCache.set(media, styleElement);
	}

	document.head.appendChild(styleElement);
	const sheet = styleElement.sheet;

	const stylesheet = getStylesheet(opts);

	const stylesheetManager = new StylesheetManager(sheet, stylesheet);

	stylesheet
		.on('insertRule', stylesheetManager.insertRule)
		.on('editRule', stylesheetManager.editRule)
		.on('deleteRule', stylesheetManager.deleteRule);

	stylesheet.addRules(styles);

	return stylesheet;
};