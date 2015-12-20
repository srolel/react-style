import createStylesheet from './src/index';

import './src/__transform-code.js';

createStylesheet.config({
	renderServerStyles: true
});

const decorator = createStylesheet({
	div: {
		color: 'red'
	}
});

const decorator2 = createStylesheet({
	div: {
		color: 'red'
	}
});
