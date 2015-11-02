import {expect} from 'chai';
import getStylesheet from '../stylesheet-api.js';

describe('stylesheet API', () => {
	it('should add styles', () => {
		const sheet = getStylesheet();

		sheet.insertRule('div', {color: 'red'});

		expect(sheet).to.have.length(1);
		expect(sheet.rules[0]).to.equal(sheet.keyedRules.div);
		expect(sheet.getRule('div')).to.deep.equal({
			pos: -1,
			rule: {color: 'red'},
			className: 'c0',
			sel: 'div'
		});

		sheet.insertRule('span', {color: 'blue'});

		expect(sheet).to.have.length(2);
		expect(sheet.rules).to.deep.equal([sheet.keyedRules.div, sheet.keyedRules.span]);
		expect(sheet.getRule('span')).to.deep.equal({
			pos: -1,
			className: 'c1',
			rule: {color: 'blue'},
			sel: 'span'
		});

	});

	it('should add styles with pos', () => {
		const sheet = getStylesheet();

		sheet.insertRule('div', {color: 'red'}, 1);

		expect(sheet).to.have.length(1);
		expect(sheet.rules[0]).to.equal(sheet.keyedRules.div);
		expect(sheet.getRule('div')).to.deep.equal({
			pos: 1,
			className: 'c0',
			rule: {color: 'red'},
			sel: 'div'
		});
	});

	it('should remove styles', () => {
		const sheet = getStylesheet();

		sheet.insertRule('div', {color: 'red'});
		sheet.deleteRule('div');

		expect(sheet).to.have.length(0);

		sheet.insertRule('div', {color: 'red'});
		expect(sheet).to.have.length(1);

		sheet.insertRule('span', {color: 'blue'});
		expect(sheet).to.have.length(2);

		sheet.deleteRule('div');
		expect(sheet).to.have.length(1);
		expect(sheet.rules[0]).to.equal(sheet.keyedRules.span);
		expect(sheet.getRule('span')).to.deep.equal({
			pos: -1,
			className: 'c2',
			rule: {color: 'blue'},
			sel: 'span'
		});

	});

	it('should edit styles', () => {
		const sheet = getStylesheet();

		sheet.insertRule('div', {color: 'red'});
		sheet.editRule('div', {background: 'blue'});

		expect(sheet).to.have.length(1);
		expect(sheet.getRule('div')).to.deep.equal({
			pos: -1,
			className: 'c0',
			rule: {color: 'red', background: 'blue'},
			sel: 'div'
		});

	});

	it('should replace styles', () => {
		const sheet = getStylesheet();

		sheet.insertRule('div', {color: 'red'});
		sheet.replaceRule('div', {background: 'blue'});

		expect(sheet).to.have.length(1);
		expect(sheet.getRule('div')).to.deep.equal({
			pos: -1,
			className: 'c0',
			rule: {background: 'blue'},
			sel: 'div'
		});
	});

});
