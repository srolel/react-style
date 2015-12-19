import {expect} from 'chai';
import getStylesheet from '../stylesheet-api.js';

// TODO: these tests are old and semi-deprecated.
// invalid tests that test capabilities that were deprecated are commended out.

describe('stylesheet API', () => {
	it('should add styles', () => {
		const sheet = getStylesheet({noHash: true});

		sheet.insertRule('div', {color: 'red'});

		expect(sheet).to.have.length(1);
		expect(sheet.rules[0]).to.equal(sheet.keyedRules.div);
		expect(sheet.getRule('div')).to.deep.equal({
			pos: -1,
			hash: '',
			rule: {color: 'red'},
			className: 'c-div',
			sel: 'div',
			spec: 0
		});

		sheet.insertRule('span', {color: 'blue'});

		expect(sheet).to.have.length(2);
		expect(sheet.rules).to.deep.equal([sheet.keyedRules.div, sheet.keyedRules.span]);
		expect(sheet.getRule('span')).to.deep.equal({
			pos: -1,
			hash: '',
			className: 'c-span',
			rule: {color: 'blue'},
			sel: 'span',
			spec: 0
		});

	});

	it('should add styles with pos', () => {
		const sheet = getStylesheet({noHash: true});

		sheet.insertRule('div', {color: 'red'}, 1);

		expect(sheet).to.have.length(1);
		expect(sheet.rules[0]).to.equal(sheet.keyedRules.div);
		expect(sheet.getRule('div')).to.deep.equal({
			pos: 1,
			hash: '',
			className: 'c-div',
			rule: {color: 'red'},
			sel: 'div',
			spec: 0
		});
	});

	it('should remove styles', () => {
		const sheet = getStylesheet({noHash: true});

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
			hash: '',
			className: 'c-span',
			rule: {color: 'blue'},
			sel: 'span',
			spec: 0
		});

	});

	// it('should edit styles', () => {
	// 	const sheet = getStylesheet({noHash: true});

	// 	sheet.insertRule('div', {color: 'red'});
	// 	sheet.editRule('div', {background: 'blue'});

	// 	expect(sheet).to.have.length(1);
	// 	expect(sheet.getRule('div')).to.deep.equal({
	// 		pos: -1,
	// 		className: 'c-div',
	// 		rule: {color: 'red', background: 'blue'},
	// 		sel: 'div'
	// 	});

	// });

	// it('should replace styles', () => {
	// 	const sheet = getStylesheet({noHash: true});

	// 	sheet.insertRule('div', {color: 'red'});
	// 	sheet.replaceRule('div', {background: 'blue'});

	// 	expect(sheet).to.have.length(1);
	// 	expect(sheet.getRule('div')).to.deep.equal({
	// 		pos: -1,
	// 		className: 'c-div',
	// 		rule: {background: 'blue'},
	// 		sel: 'div'
	// 	});
	// });

	// it('should stringify styles', () => {
	// 	const sheet = getStylesheet({noHash: true});

	// 	sheet.insertRule('div', {color: 'red', background: 'blue'});

	// 	const styleString = sheet.stringify();
	// 	expect(styleString.replace(/\s/g, '')).to.equal('.c5-0{color:red;background:blue;}')
	// });

	// it('should stringify styles with media queries', () => {
	// 	const sheet = getStylesheet({media: '(max-width: 1024px)'});

	// 	sheet.insertRule('div', {color: 'red', background: 'blue'});

	// 	const styleString = sheet.stringify();
	// 	expect(styleString.replace(/\s/g, '')).to.equal('@media(max-width:1024px){.c6-0{color:red;background:blue;}}')
	// });

});
