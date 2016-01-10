import createStylesheet from '../index';
import _ from 'lodash';

const defaultModuleName = 'react-stylesheets';
const defaultTagName = 'reactStyle.*';

export default ({types: t}) => {

	const isStringOrMatchesRegexp = (str, matcher) => {
		if (str === matcher) {
			return true;
		}

		const matcherRegex = new RegExp(matcher);

		if (matcherRegex.test(str)) {
			return true;
		}

		return false;
	};

	const isTheModule = (str, matcher = defaultModuleName) => isStringOrMatchesRegexp(str, matcher);

	const isTheTag = (str, matcher = defaultTagName) => isStringOrMatchesRegexp(str, matcher);

	const replaceRulesWithClassNames = (path, rules) =>
		path.replaceWith(t.objectExpression(
			rules.map(({sel, className}) =>
				t.ObjectProperty(
					t.identifier(sel),
					t.stringLiteral(className)))
		));

	const getRuleObjectPath = (path) => {

		let ruleObjectPath;

		if (path.isObjectExpression()) {
			ruleObjectPath = path;
		}

		if (path.isIdentifier()) {
			const name = path.node.name;
			const bindingPath = path.scope.bindings[name].path;
			ruleObjectPath = bindingPath.get('init');
		}

		return ruleObjectPath;
	};

	const replaceRuleObjectWithClassNames = (ruleObjectPath) => {
		// writing a function to turn an ObjectExpression to an object literal might be better here.
		const rulesObject = eval(`(${ruleObjectPath.getSource()})`);

		const rules = createStylesheet(rulesObject, {renderServerStyles: true});
		replaceRulesWithClassNames(ruleObjectPath, rules);
	};

	const callExpressionVisitor = {
		CallExpression(path) {
			if (path.node.callee.name === this.name) {
				const [firstArgument] = path.get('arguments');

				const ruleObjectPath = getRuleObjectPath(firstArgument);

				replaceRuleObjectWithClassNames(ruleObjectPath);

			}
		}
	};

	const getNextNodePath = path => {
		const {container} = path;
		const nodeIndex = _.findIndex(container, node => node === path.node);
		return container[nodeIndex + 1]._paths[0];
	};

	return {
		visitor: {
			ImportDeclaration(path, state) {

				const moduleName = path.get('source.value').node;

				if (isTheModule(moduleName, state.opts.module)) {
					const specifiers = path.get('specifiers');
					const defaultSpecifier = _.find(specifiers, spec => spec.isImportDefaultSpecifier());
					const name = defaultSpecifier.get('local.name').node;
					path.parentPath.traverse(callExpressionVisitor, {name});
				}
			},

			ExpressionStatement(path, state) {
				const expression = path.get('expression');
				if (expression.isStringLiteral() &&
					isTheTag(expression.node.value, state.opts.tag)) {

					const ruleObjectPath = getNextNodePath(path).get('init');

					replaceRuleObjectWithClassNames(ruleObjectPath);
					expression.remove();

				}
			}

		}
	};
};
