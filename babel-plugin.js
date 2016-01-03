import fs from 'fs';
import Promise from 'bluebird';
import * as babel from 'babel-core';
import _ from 'lodash';
import plugin from './babel-transform';

Promise.promisifyAll(fs);
Promise.promisifyAll(babel);

const compile = async () => {
	try {
		const fileName = 'babel-test.js';
		const transformed = await babel.transformFileAsync(fileName, {
			plugins: [[plugin, {
				module: './src/index'
			}]]
		});
		console.log(transformed.code)
	} catch(e) {
		console.error(e);
	}
};

compile();
