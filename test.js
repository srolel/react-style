import jss from './src/index';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import postcssJs from 'postcss-js';
import autoprefixer from 'autoprefixer';
import nested from 'postcss-nested';

jss.config({
	parser: postcssJs.sync([ nested, autoprefixer ])
})

const dec = jss({
	div: {
		'@media all': {
		transform: 'translateX(0)',

		':hover': {
			color: 'red',
			span: {
				color: 'blue'
			}
		}
	},
	'.wat': {
		color: 'green'
	}
	}
}, {media: '@media screen'});

const TestComponent = dec(class extends React.Component {
	render() {
		return <div></div>;
	}
});

console.log(ReactDOMServer.renderToStaticMarkup(<TestComponent/>));
const s = document.styleSheets;
console.log(s[s.length - 1].rules)
console.log(jss.getSheetsAsString())