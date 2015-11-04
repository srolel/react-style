import detectNode from 'detect-node';
import getStylesheet from './stylesheet-api.js';

export const stylesheets = [];

const createServerStylesheet = styles => {
	const sheet = getStylesheet();
	sheet.addRules(styles);
	stylesheets.push(sheet);
	return sheet;
};

const createBrowserStylesheet = styles => {
	const styleElement = document.createElement('style');
	document.head.appendChild(styleElement);
	const sheet = styleElement.sheet;

	const stylesheet = getStylesheet();

	stylesheet.on('insertRule', r =>
		sheet.insertRule(stylesheet.getCSSRules(r)));

	stylesheet.addRules(styles);

	return stylesheet;
};

export default styles => detectNode
	? createServerStylesheet(styles)
	: createBrowserStylesheet(styles);
