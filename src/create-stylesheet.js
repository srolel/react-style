import getStylesheet from './stylesheet-api.js';

export default (styles, opts) => {
	const stylesheet = getStylesheet(opts);
	return stylesheet;
};