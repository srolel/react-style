import transformStyle from '../transform-style';
import {expect} from 'chai';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

describe('transform-style', () => {
	it('should merge style array', () => {

		@transformStyle
		class Test extends React.Component {
			render() {
				return <div style={[{color: 'red'}, {color: 'blue', width: '10px'}]}/>;
			}
		}

		const rendered = ReactDOMServer.renderToStaticMarkup(<Test/>);
		expect(rendered).to.equal('<div style="color:blue;width:10px;"></div>');
	});

});
