import StylesheetApi from './stylesheet-api.js';
import {applyPlugins} from '../plugins/index';

applyPlugins.api(StylesheetApi);

let numStylesheets = 0;

export const getStylesheet = (opts) => {
	return new StylesheetApi({id: numStylesheets++, ...opts});
};

export default (styles, opts) => {
	const stylesheet = getStylesheet(opts);

	return stylesheet;
};
