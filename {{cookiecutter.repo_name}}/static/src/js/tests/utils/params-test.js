/* global describe it */

import { expect } from 'chai';

import encodeParams from '../../utils/params';


describe('Params', () => {
    it('encodes one component', () => {
        const result = encodeParams({ foo: 'bar ?%' });
        expect(result).to.equal('foo=bar%20%3F%25');
    });

    it('encodes more components', () => {
        const result = encodeParams({ foo: 1, bar: '2?% ', 3: null }).split('&').sort();
        expect(result).to.eql(['3=null', 'bar=2%3F%25%20', 'foo=1']);
    });
});
