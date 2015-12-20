import getStylesheet from './stylesheet-api.js';
import {applyPlugins} from '../plugins/index';

export default (styles, opts) => {
	const stylesheet = getStylesheet(opts);
	applyPlugins.api(stylesheet);

	return stylesheet;
};
