import { describe, it } from 'node:test';

import { expect } from 'chai';

import { DétailCandidatureRaw } from '../détailCandidature.type';

import { cleanDétails } from './cleanDétails';

describe('cleanDétails', () => {
  it('Doit supprimer les clés vides du détail', () => {
    const détail: DétailCandidatureRaw = {
      nom: 'Jean Dupont',
      '': 'Valeur vide',
    };

    const expectedDétail = {
      nom: 'Jean Dupont',
    };

    const result = cleanDétails(détail);
    expect(result).to.deep.equal(expectedDétail);
  });
  it('doit supprimer les valeurs vide du détail', () => {
    const détail: DétailCandidatureRaw = {
      nom: 'Jean Dupont',
      age: '',
    };

    const expectedDétail = {
      nom: 'Jean Dupont',
    };

    const result = cleanDétails(détail);
    expect(result).to.deep.equal(expectedDétail);
  });
  it('doit supprimer les valeurs undefined du détail', () => {
    const détail: DétailCandidatureRaw = {
      nom: 'Jean Dupont',
      age: undefined,
    };

    const expectedDétail = {
      nom: 'Jean Dupont',
    };

    const result = cleanDétails(détail);
    expect(result).to.deep.equal(expectedDétail);
  });
});
