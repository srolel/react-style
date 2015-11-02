import createStylesheet from './browser-styles.js';
import reactribute from 'reactribute';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {extend} from './utils.js';
import {jsdom} from 'jsdom';

global.window = jsdom().defaultView;
global.document = global.window.document;

const styleSheet = {
	div: {
		height: '50px',
		width: '50px',
		background: 'red',
		':hover': {
			background: 'yellow'
		}
	},
	span: {
		height: '50px',
		width: '50px',
		background: 'blue',
		display: 'inline-block'
	}
};

const stylesheet = createStylesheet(styleSheet);
const decorator = reactribute(stylesheet.rules.map(r => ({
	matcher: r.sel,
	fn({props}) {
		return {props: extend({}, props, {className: r.className})};
	}
})));

const Test = decorator(() => {
	return <div/>
});

ReactDOMServer.renderToStaticMarkup(<Test/>);

console.log(global.document.styleSheets[0].cssRules)

