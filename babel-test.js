import createStylesheet, {wat} from './src/index';


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
