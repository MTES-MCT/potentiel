import test, { describe } from 'node:test';

import { expect } from 'chai';

import { getSearchParamsEnumValue } from './getSearchParamsEnumValue';

describe('getSearchParamsEnumValue', () => {
  test('Une URL avec une valeur autorisée doit retourner cette valeur', () => {
    const searchParams = new URLSearchParams('type=laureat');
    const actual = getSearchParamsEnumValue(searchParams, 'type', ['laureat', 'candidature']);
    expect(actual).to.eq('laureat');
  });

  test('Une URL avec une valeur non autorisée doit retourner undefined', () => {
    const searchParams = new URLSearchParams('type=autre');
    const actual = getSearchParamsEnumValue(searchParams, 'type', ['laureat', 'candidature']);
    expect(actual).to.eq(undefined);
  });

  test('Une URL sans la valeur doit retourner undefined', () => {
    const searchParams = new URLSearchParams('');
    const actual = getSearchParamsEnumValue(searchParams, 'type', ['laureat', 'candidature']);
    expect(actual).to.eq(undefined);
  });
});
