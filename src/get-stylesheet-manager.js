import getStylesheet from './stylesheet-api.js';
import StylesheetManager from './stylesheet-manager';
import getDOMStylesheet from './get-dom-stylesheet';
// ruleLengthCache a stylesheet for each media query. Not sure if this is actually useful but it feels more organized.

export const stylesheetManagerCache = {};

export default (opts) => {
	const {media} = opts;
	const DOMSheet = getDOMStylesheet(media);
	const stylesheetManager = stylesheetManagerCache[media]
	if (stylesheetManager) {
		return stylesheetManager;
	} else {
     	stylesheetManagerCache[media] = new StylesheetManager(DOMSheet, opts);
     	return stylesheetManagerCache[media]
	}
};