require('babel-core/register');
const jss = require('./src/index.js').default;
jss({
	div: {
		height: 5
	}
})