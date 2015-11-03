import getStylesheet from './stylesheet-api.js';

export const stylesheets = [];

export default styles => {
	const sheet = getStylesheet();
	sheet.addRules(styles);
	stylesheets.push(sheet);
	return sheet;
};
