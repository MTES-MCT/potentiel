import { describe, it } from 'node:test';

import { expect } from 'chai';

import { cleanDétailsEntries } from './cleanDétailsEntries';

describe('cleanDétailsEntries', () => {
  it('Doit supprimer les retours à la ligne dans les clés', () => {
    const data = {
      ['nom\n']: 'Jean Dupont',
    };

    const expectedDétail = {
      nom: 'Jean Dupont',
    };

    const result = cleanDétailsEntries(data);

    expect(result).to.deep.equal(expectedDétail);
  });
  it('doit supprimer les retours à la ligne dans les valeurs', () => {
    const data = {
      nom: 'Jean\n Dupont',
    };

    const expectedDétail = {
      nom: 'Jean Dupont',
    };

    const result = cleanDétailsEntries(data);
    expect(result).to.deep.equal(expectedDétail);
  });
});
