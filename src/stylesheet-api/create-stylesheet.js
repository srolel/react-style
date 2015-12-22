import Stylesheet from './stylesheet-api.js';
import {applyPlugins} from '../plugins/index';

applyPlugins.api(Stylesheet);

let numStylesheets = 0;

export const getStylesheet = (opts) => new Stylesheet({id: numStylesheets++, ...opts});

export default (styles, opts) => {
	const stylesheet = getStylesheet(opts);

	return stylesheet;
};
