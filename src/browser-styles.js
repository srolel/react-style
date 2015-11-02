import getStylesheet from './stylesheet-api.js';
export default styles => {
	const styleElement = document.createElement('style');
	document.head.appendChild(styleElement);
	const sheet = styleElement.sheet;

	const stylesheet = getStylesheet();

	stylesheet.on('insertRule', r =>
		sheet.insertRule(stylesheet.stringify(r)));

	stylesheet.addRules(styles);

	return stylesheet;
};
