import detectNode from 'detect-node';
import StylesheetManager from './stylesheet-manager.js';
import createServerStylesheet from './create-server-stylesheet.js';
import createBrowserStylesheet from './create-browser-stylesheet.js';

// this is exposed to access the rendered CSS. should be a better API like wrapping ReactDOM.Render on the server.
export stylesheets from './create-server-stylesheet.js';

export default (...args) => detectNode
	? createServerStylesheet(...args)
	: createBrowserStylesheet(...args);
