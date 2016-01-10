import transformClassname from '../transform-classname';
import {expect} from 'chai';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

describe('transform-classname', () => {
	it('should apply classnames to className', () => {
		@transformClassname
		class Test extends React.Component {
			render() {
				return <div className={['wat', {hmm: true}]}/>;
			}
		}

		const rendered = ReactDOMServer.renderToStaticMarkup(<Test/>);
		expect(rendered).to.equal('<div class="wat hmm"></div>');
	});

	it('should apply classnames to classSet', () => {
		@transformClassname
		class Test extends React.Component {
			render() {
				return <div classSet={['wat', {hmm: true}]}/>;
			}
		}

		const rendered = ReactDOMServer.renderToStaticMarkup(<Test/>);
		expect(rendered).to.equal('<div class="wat hmm"></div>');
	});

});
