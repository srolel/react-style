import Rule from './style-rule.js';
import {applyPlugins} from '../plugins/index';

applyPlugins.rule(Rule);

export default (...args) => new Rule(...args);