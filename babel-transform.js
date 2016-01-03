import createStylesheet from './src/index';
import _ from 'lodash';

const defaultModuleName = 'react-stylesheets';

export default ({types: t}) => {

	const stringTagMatcher = str => str.match(/reactStyle.*/);

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

				const moduleName = state.opts.module || defaultModuleName
;
				if (path.get('source.value').node === moduleName) {
					const specifiers = path.get('specifiers');
					const defaultSpecifier = _.find(specifiers, spec => spec.isImportDefaultSpecifier());
					const name = defaultSpecifier.get('local.name').node;
					path.parentPath.traverse(callExpressionVisitor, {name});
				}
			},

			ExpressionStatement(path) {
				const expression = path.get('expression');
				if (expression.isStringLiteral() &&
					stringTagMatcher(expression.node.value)) {

					const ruleObjectPath = getNextNodePath(path).get('init');

					replaceRuleObjectWithClassNames(ruleObjectPath);
					expression.remove();

				}
			}

		}
	};
};
