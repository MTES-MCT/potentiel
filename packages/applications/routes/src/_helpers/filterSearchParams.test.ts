import it, { describe } from 'node:test';

import { expect } from 'chai';

import { FiltersSearchParams } from './filterSearchParams.js';

describe(FiltersSearchParams.name, () => {
  describe('constructor', () => {
    it('should accept empty search params', () => {
      const searchParams = new FiltersSearchParams();
      expect(searchParams.toString()).to.equal('');
    });
    it('should copy given search params', () => {
      const inputSearchParams = new URLSearchParams('foo=bar&baz=qux');
      const searchParams = new FiltersSearchParams(inputSearchParams);
      expect(searchParams.toString()).to.equal('foo=bar&baz=qux');
    });
  });

  describe('getAll', () => {
    it("should return an empty array if the key doesn't exist", () => {
      const searchParams = new FiltersSearchParams('foo=bar');
      expect(searchParams.getAll('baz')).to.deep.equal([]);
    });

    it('should return an array of values for a given key', () => {
      const searchParams = new FiltersSearchParams('foo=bar|baz|qux');
      expect(searchParams.getAll('foo')).to.deep.equal(['bar', 'baz', 'qux']);
    });

    it('should ignore multiple occurrences of the same key and return unique values', () => {
      const searchParams = new FiltersSearchParams('foo=bar&foo=qux');
      expect(searchParams.getAll('foo')).to.deep.equal(['bar']);
    });
  });
  describe('deleteOne', () => {
    it('should remove a specific value for a given key', () => {
      const searchParams = new FiltersSearchParams('foo=bar|baz|qux');
      searchParams.deleteOne('foo', 'baz');
      expect(searchParams.getAll('foo')).to.deep.equal(['bar', 'qux']);
    });

    it('should delete the key if the last value is removed', () => {
      const searchParams = new FiltersSearchParams('foo=bar');
      searchParams.deleteOne('foo', 'bar');
      expect(searchParams.getAll('foo')).to.deep.equal([]);
    });

    it("should do nothing if the key doesn't exist", () => {
      const searchParams = new FiltersSearchParams('foo=bar');
      searchParams.deleteOne('baz', 'qux');
      expect(searchParams.toString()).to.equal('foo=bar');
    });

    it('should handle URL encoded params', () => {
      const searchParams = new FiltersSearchParams(
        'appelOffre=CRE4+-+Autoconsommation+m%C3%A9tropole%7CCRE4+-+Autoconsommation+m%C3%A9tropole+2016',
      );
      searchParams.deleteOne('appelOffre', 'CRE4 - Autoconsommation métropole');
      expect(searchParams.toString()).to.equal(
        'appelOffre=CRE4+-+Autoconsommation+m%C3%A9tropole+2016',
      );
    });
  });
});
