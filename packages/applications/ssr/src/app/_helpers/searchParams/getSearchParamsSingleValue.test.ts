import test, { describe } from 'node:test';

import { expect } from 'chai';

import { getSearchParamsSingleValue } from './getSearchParamsSingleValue';

describe('getSearchParamsSingleValue', () => {
  test('Une URL sans search params simple doit retourner undefined', () => {
    const searchParams = new URLSearchParams('/home');
    const actual = getSearchParamsSingleValue(searchParams, 'foo');
    expect(actual).to.eq(undefined);
  });

  test('Une URL avec un search params simple vide doit retourner undefined', () => {
    const searchParams = new URLSearchParams('foo=');
    const actual = getSearchParamsSingleValue(searchParams, 'foo');
    expect(actual).to.eq(undefined);
  });

  test('Une URL avec un search params simple doit retourner sa valeur', () => {
    const searchParams = new URLSearchParams('foo=bar');
    const actual = getSearchParamsSingleValue(searchParams, 'foo');
    expect(actual).to.eq('bar');
  });
});
