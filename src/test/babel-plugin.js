import babelPlugin from '../babel-plugin/index';
import {expect} from 'chai';
import * as babel from 'babel-core';

const code = `

import createStylesheet, {wat} from 'react-stylesheets';

const styles = {
	div: {
		color: 'red'
	}
};

'reactStyle';
const styles2 = {
	div: {
		color: 'blue'
	}
};

const decorator = createStylesheet(styles);

const decorator2 = createStylesheet({
	div: {
		color: 'red',
		wat: {
			 background: 'red'
		}
	},

});
`;


describe('babel-plugin', () => {
	it('should transform source with stylesheets', () => {
		const transformed = babel.transform(code, {
			plugins: [babelPlugin]
		});
		expect(transformed.code.match(/const styles = {\n\s*div: ['"]c[\d-]*-div'\n};/));
		expect(transformed.code.match(/const styles2 = {\n\s*div: ['"]c[\d-]*-div'\n};/));
		expect(transformed.code.match(/const decorator2 = createStylesheet\(\{\n\s*div: ['"]c[\d-]*-div'\n\}\);/));
	});

	it('should take module name option', () => {
		let transformed = babel.transform(code, {
			plugins: [[babelPlugin, {
				module: 'moduleName'
			}]]
		});
		expect(transformed.code.match(/div: ['"]c[\d-]*-div/g).length).to.equal(1);

		transformed = babel.transform(code.replace('react-stylesheets', 'moduleName'), {
			plugins: [[babelPlugin, {
				module: 'moduleName'
			}]]
		});
		expect(transformed.code.match(/div: ['"]c[\d-]*-div/g).length).to.equal(3);
	});

	it('should take tag name option', () => {
		let transformed = babel.transform(code, {
			plugins: [[babelPlugin, {
				tag: 'tagName'
			}]]
		});
		expect(transformed.code.match(/div: ['"]c[\d-]*-div/g).length).to.equal(2);

		transformed = babel.transform(code.replace('reactStyle', 'tagName'), {
			plugins: [[babelPlugin, {
				tag: 'tagName'
			}]]
		});
		expect(transformed.code.match(/div: ['"]c[\d-]*-div/g).length).to.equal(3);
	});
});
