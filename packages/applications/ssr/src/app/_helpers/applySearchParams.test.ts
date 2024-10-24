import test, { describe } from 'node:test';

import { expect } from 'chai';

import { applySearchParams } from './applySearchParams';

describe('applySearchParams', () => {
  test('Given an empty object, it returns no search params', () => {
    const url = '/home';
    const expected = `/home`;
    const actual = applySearchParams(url, {});
    expect(actual).to.eq(expected);
  });

  test('Given some params passed as parameter, it returns a valid url', () => {
    const url = '/home';
    const expected = `/home?foo=bar`;
    const actual = applySearchParams(url, { foo: 'bar' });
    expect(actual).to.eq(expected);
  });

  test('Given some params in the URL and no overrides, it returns a valid url', () => {
    const url = '/home?foo=bar';
    const expected = `/home?foo=bar`;
    const actual = applySearchParams(url, {});
    expect(actual).to.eq(expected);
  });

  test('Given some params in the URL and some overrides, it returns a valid url', () => {
    const url = '/home?foo=bar';
    const expected = `/home?foo=baz`;
    const actual = applySearchParams(url, { foo: 'baz' });
    expect(actual).to.eq(expected);
  });

  test('Given some params in the URL and some others passed as parameters, it returns a valid url with merged params', () => {
    const url = '/home?foo=bar';
    const expected = `/home?foo=bar&baz=qux`;
    const actual = applySearchParams(url, { baz: 'qux' });
    expect(actual).to.eq(expected);
  });
});
