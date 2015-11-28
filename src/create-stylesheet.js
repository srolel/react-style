import getStylesheet from './stylesheet-api.js';
import StylesheetManager from './stylesheet-manager';
// ruleLengthCache a stylesheet for each media query. Not sure if this is actually useful but it feels more organized.

export default (styles, opts) => {

	const stylesheet = getStylesheet(opts);

	return stylesheet;
};