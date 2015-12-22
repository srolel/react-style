import StylesheetManager from './stylesheet-manager';
import getDOMStylesheet from './get-dom-stylesheet';
import {applyPlugins} from '../plugins/index';

applyPlugins.manager(StylesheetManager);

export let stylesheetManagerCache = {};

export const clearCache = () => stylesheetManagerCache = {};

export default (opts) => {
	const {media} = opts;
	const DOMSheet = getDOMStylesheet(media);
	const stylesheetManager = stylesheetManagerCache[media];
	if (stylesheetManager) {
		return stylesheetManager;
	} else {
		stylesheetManagerCache[media] = new StylesheetManager(DOMSheet, opts);
		return stylesheetManagerCache[media];
	}
};
