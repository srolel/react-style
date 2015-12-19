import createStylesheet from '../index';
import {expect} from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import TestUtils from 'react-addons-test-utils';
import {jsdom} from 'jsdom';

import {clearCache as clearDOMStylesheetCache} from '../get-dom-stylesheet';
import {clearCache as clearStylesheetManagerCache} from '../get-stylesheet-manager';

import postcssJs from 'postcss-js';
import autoprefixer from 'autoprefixer';
import nested from 'postcss-nested';

global.window = jsdom().defaultView;
global.document = global.window.document;

const jsontocss = obj => {
	return JSON.stringify(obj)
		.replace(/(^\{)|(\}$)/g, '')
		.replace(/,/g, ';')
		.replace(/:\{/g, '{')
		.replace(/\}/g, ';}')
		.replace(/"/g, '');
};

const styleObjToRegex = style => new RegExp(`c[-\\d]+-${jsontocss(style)}`);
const getStyleStringFromDecorator = decorator => decorator.stylesheetManager.DOMStyleElement.innerHTML;

afterEach(() => {
	clearDOMStylesheetCache();
	clearStylesheetManagerCache();
});

describe('react-stylesheets', () => {
	it('should enhance a react component', () => {

		const styles = {
			div: {
				color: 'red'
			}
		};

		const decorator = createStylesheet(styles);

		@decorator
		class Test extends React.Component {
			render() {
				return <div/>;
			}
		}
		const instance = TestUtils.renderIntoDocument(<Test/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.className).to.equal(decorator.stylesheetManager.rules[0].className);
		const styleString = getStyleStringFromDecorator(decorator).replace(/[\s\r\n]*/g, '');
		expect(styleString).to.match(styleObjToRegex(styles));

	});

	it('should enhance a react component with a parser', () => {

		const createStylesheetWithParser = createStylesheet.create({
			parser: postcssJs.sync([ nested, autoprefixer({ browsers: ['> 1%', 'IE 9']}) ])
		});

		const styles = {
			div: {
				transform: 'translate(1px, 1px)',
				span: {
					display: 'none'
				}
			}
		};

		const decorator = createStylesheetWithParser(styles);

		@decorator
		class Test extends React.Component {
			render() {
				return <div/>;
			}
		}

		const instance = TestUtils.renderIntoDocument(<Test/>);
		const node = ReactDOM.findDOMNode(instance);
		expect(node.className).to.equal(decorator.stylesheetManager.rules[0].className);
		const styleString = getStyleStringFromDecorator(decorator);
		expect(styleString).to.include('-ms-transform');
		expect(styleString).to.include('div span');

	});

	it('should not create multiple classes with identical rules', () => {


		const styles = {
			div: {
				backgroundColor: 'red',
				color: 'blue'
			},
			span: {
				color: 'blue',
				backgroundColor: 'red'
			}
		};

		const decorator = createStylesheet(styles);

		@decorator
		class Test extends React.Component {
			render() {
				return <div><span ref="span"/></div>;
			}
		}

		const instance = TestUtils.renderIntoDocument(<Test/>);
		const divNode = ReactDOM.findDOMNode(instance);
		const spanNode = instance.refs.span;

		const {rules} = decorator.stylesheetManager;
		const {classList, className} = rules[0];

		expect(divNode.className).to.equal(classList[0]);
		expect(spanNode.className).to.equal(classList[1]);
		const styleString = getStyleStringFromDecorator(decorator);
		expect(styleString).to.include(className);

	});

});
