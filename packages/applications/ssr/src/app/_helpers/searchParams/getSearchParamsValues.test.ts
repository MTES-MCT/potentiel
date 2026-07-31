import test, { describe } from 'node:test';

import { expect } from 'chai';

import { getSearchParamsValues } from './getSearchParamsValues';

describe('getSearchParamsValues', () => {
  test('Une URL avec des search params simple et multiple doit retourner un objet contenant les clés renseignées correctement typées', () => {
    const searchParams = new URLSearchParams('periode=1&appelOffre=bar|baz');

    const actual = getSearchParamsValues({
      searchParams,
      config: { periode: 'single', appelOffre: 'multiple' },
    });

    expect(actual).to.deep.eq({ periode: '1', appelOffre: ['bar', 'baz'] });
  });

  test('Une URL sans search params doit retourner un objet contenant les clés renseignées à undefined', () => {
    const searchParams = new URLSearchParams('');

    const actual = getSearchParamsValues({
      searchParams,
      config: { periode: 'single', appelOffre: 'multiple' },
    });

    expect(actual).to.deep.eq({ periode: undefined, appelOffre: undefined });
  });
});
