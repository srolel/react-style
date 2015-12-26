import getStylesheet, {Stylesheet} from './stylesheet-api.js';
import composeMiddleware from './middleware/compose';


export default (styles, opts) => {
	const stylesheet = getStylesheet(opts);
	composeMiddleware(stylesheet);

	return stylesheet;
};
