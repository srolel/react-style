import {expect} from 'chai';
import {pickByRegex} from '../transform-style-object.js';

describe('pickByRegex', () => {
	it('should deal with null, undefined, string, number', () => {
		expect(() => pickByRegex(null, null)).to.throw(Error);
		expect(() => pickByRegex(undefined, undefined)).to.throw(Error);
		expect(pickByRegex(null, /a/)).to.deep.equal({});
	});

	it('should pick propertyies based on regex', () => {
		expect(pickByRegex({}, /a/)).to.deep.equal({});
		expect(pickByRegex({a: 1}, /a/)).to.deep.equal({a: 1});
		expect(pickByRegex({a: 1}, /b/)).to.deep.equal({});
		expect(pickByRegex({a: 1, ab: 2}, /b/)).to.deep.equal({ab: 2});
		expect(pickByRegex({a: 1, ab: 2}, /a/)).to.deep.equal({a: 1, ab: 2});
		expect(pickByRegex({wat: 1, wot: 2}, /w\wt/)).to.deep.equal({wat: 1, wot: 2});
	});
});
