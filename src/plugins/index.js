import flow from 'lodash/function/flow';
import * as compose from './compose/index';
import * as spec from './spec/index';

const plugins = {
	api: [],
	rule: [],
	manager: []
};

const applyPlugin = plugin => (...args) =>
	plugin.reduce((res, cur) =>
		Array.isArray(res = res || args)
			? cur(...res)
			: cur(res), args);

const registerPlugin = ({api, rule, manager}) => {
	api && plugins.api.push(api);
	rule && plugins.rule.push(rule);
	manager && plugins.manager.push(manager);
};

registerPlugin(compose);
registerPlugin(spec);

for (let k in plugins) {
	const plugin = plugins[k];
	if (plugin.length) {
		plugins[k] = applyPlugin(plugin);
	}
}

export const applyPlugins = plugins;

