import getStylesheet from './stylesheet-api.js';
export const stylesheets = [];

export default (styles, opts) => {
	const sheet = getStylesheet(opts);
	sheet.addRules(styles);
	stylesheets.push(sheet);
	return sheet;
};