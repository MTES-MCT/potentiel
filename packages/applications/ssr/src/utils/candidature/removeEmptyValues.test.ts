import { describe, it } from 'node:test';

import { expect } from 'chai';

import { removeEmptyValues } from './removeEmptyValues';

describe('removeEmptyValues', () => {
  it('Doit supprimer les clés vides', () => {
    const data = {
      nom: 'Jean Dupont',
      '': 'Valeur vide',
    };

    const expectedDétail = {
      nom: 'Jean Dupont',
    };

    const result = removeEmptyValues(data);
    expect(result).to.deep.equal(expectedDétail);
  });
  it('doit supprimer les valeurs vide', () => {
    const data = {
      nom: 'Jean Dupont',
      age: '',
    };

    const expectedDétail = {
      nom: 'Jean Dupont',
    };

    const result = removeEmptyValues(data);
    expect(result).to.deep.equal(expectedDétail);
  });
  it('doit supprimer les valeurs undefined', () => {
    const data = {
      nom: 'Jean Dupont',
      age: undefined,
    };

    const expectedData = {
      nom: 'Jean Dupont',
    };

    const result = removeEmptyValues(data);
    expect(result).to.deep.equal(expectedData);
  });
  it('doit supprimer les valeurs "N/A", "#N/A" et "0"', () => {
    const data = {
      nom: 'Jean Dupont',
      statut1: 'N/A',
      statut2: '#N/A',
      statut3: '0',
    };

    const expectedData = {
      nom: 'Jean Dupont',
    };

    const result = removeEmptyValues(data);
    expect(result).to.deep.equal(expectedData);
  });
});
