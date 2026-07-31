import test, { describe } from 'node:test';

import { expect } from 'chai';

import { getSearchParamsMultipleValues } from './getSearchParamsMultipleValues';

describe('getSearchParamsMultipleValues', () => {
  test('Aucun search params doit retourner undefined', () => {
    const searchParams = new URLSearchParams('/home');
    const actual = getSearchParamsMultipleValues(searchParams, 'foo');
    expect(actual).to.eq(undefined);
  });

  test('Un search params avec une seule valeur doit retourner un tableau avec sa valeur', () => {
    const searchParams = new URLSearchParams('foo=bar');
    const expected = ['bar'];
    const actual = getSearchParamsMultipleValues(searchParams, 'foo');
    expect(actual).to.deep.eq(expected);
  });

  test('Un search params avec plusieurs valeurs doit retourner un tableau avec ses valeurs', () => {
    const searchParams = new URLSearchParams('foo=bar|baz');
    const expected = ['bar', 'baz'];
    const actual = getSearchParamsMultipleValues(searchParams, 'foo');
    expect(actual).to.deep.eq(expected);
  });

  test('Un search params avec une valeur vide doit retourner undefined', () => {
    const searchParams = new URLSearchParams('foo=');
    const actual = getSearchParamsMultipleValues(searchParams, 'foo');
    expect(actual).to.deep.eq(undefined);
  });
});
