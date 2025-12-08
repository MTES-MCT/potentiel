import test, { describe } from 'node:test';

import { expect } from 'chai';

import { mapToRangeOptions } from './pagination.js';

describe('pagination', () => {
  test('should accept undefined', () => {
    expect(mapToRangeOptions(undefined)).to.deep.equal({ startPosition: 0, endPosition: 49 });
  });
  test('should accept NaN', () => {
    expect(mapToRangeOptions(NaN)).to.deep.equal({ startPosition: 0, endPosition: 49 });
  });
  test('should accept the last position of previous page', () => {
    expect(mapToRangeOptions(49)).to.deep.equal({ startPosition: 50, endPosition: 99 });
  });
  test('should accept any valid position', () => {
    expect(mapToRangeOptions(25)).to.deep.equal({ startPosition: 26, endPosition: 75 });
  });

  test('should accept zero as a valid position', () => {
    expect(mapToRangeOptions(0)).to.deep.equal({ startPosition: 0, endPosition: 49 });
  });

  test('should handle large position numbers', () => {
    expect(mapToRangeOptions(999)).to.deep.equal({ startPosition: 1000, endPosition: 1049 });
  });

  test('should handle very large position numbers', () => {
    expect(mapToRangeOptions(1000000)).to.deep.equal({
      startPosition: 1000001,
      endPosition: 1000050,
    });
  });

  test('should reject a negative position', () => {
    expect(() => mapToRangeOptions(-12)).to.throw('Invalid "after" value');
  });
});
