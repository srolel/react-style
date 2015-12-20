import flow from 'lodash/function/flow';
import * as compose from './compose/index';

const plugins = {
	api: [],
	rule: [],
	manager: []
};

const registerPlugin = ({api, rule, manager}) => {
	api && plugins.api.push(api);
	rule && plugins.rule.push(rule);
	manager && plugins.manager.push(manager);
};

registerPlugin(compose);

for (let k in plugins) {
	const plugin = plugins[k];
	if (plugin.length) {
		plugins[k] = flow(...plugin);
	}
}

export const applyPlugins = plugins;

