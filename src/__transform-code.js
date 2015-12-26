import stacktrace from 'stacktrace-js';
import reactStyles from './index';
import fs from 'fs';
import Promise from 'bluebird';
import * as babel from 'babel-core';
import _ from 'lodash';

const getPlugin = (data) => function ({ types: t }) {
	console.log(data)
	const replaceWithRules = (path, rules) =>
		path.replaceWith(t.objectExpression(
			rules.map(([key, value]) => t.ObjectProperty(t.identifier(key), t.stringLiteral(value)))
		));

  return {
		visitor: {
			CallExpression(path) {
				const datum = _.find(data, ({lineNumber}) => _.get(path, 'node.loc.start.line') === lineNumber)
				if (datum) {
					const argument = path.node.arguments[0];
					if (t.isIdentifier(argument)) {
						const {name} = argument;
						const binding = path.scope.bindings[name];
						const referencePath = binding.referencePaths[0];
						replaceWithRules(referencePath, datum.rules);
						binding.path.remove();
					} else if (t.isObjectExpression(argument)) {
						const argumentPath = argument._paths[0].parentPath;
						replaceWithRules(argumentPath, datum.rules);
					}
				}
			}
		}
	};
};

Promise.promisifyAll(fs);
Promise.promisifyAll(babel);

const data = {};

global.__transform_react_styles = rules => {

	stacktrace
		.get()
		.then(async trace => {

			trace = _.dropWhile(trace, s =>
				s.functionName !== reactStyles.name);

			const lastContextBeforeCall = trace[1];
			const {fileName, lineNumber} = lastContextBeforeCall;
			data[fileName] = data[fileName] || [];
			data[fileName].push({lineNumber, rules});

			// console.log(transformed.code)
		})
		.catch(e => console.error(e.stack));
};

const compile = global.compile = async () => {
	try {
		for (let fileName of Object.keys(data)) {
			const calls = data[fileName];
				const transformed = await babel.transformFileAsync(fileName, {
					plugins: [getPlugin(calls)]
				});
				console.log(transformed.code)
		}
	} catch(e) {
		console.error(e);
	}
};
