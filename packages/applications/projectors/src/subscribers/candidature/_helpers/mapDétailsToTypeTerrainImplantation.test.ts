import test from 'node:test';

import { expect } from 'chai';

import { mapDétailsToTypeTerrainImplantation } from './mapDétailsToTypeTerrainImplantation.js';

const casÀTester = [
  { input: '1', expected: 'cas 1' },
  { input: '2 bis', expected: 'cas 2 bis' },
  { input: 'cas 1', expected: 'cas 1' },
  { input: 'Cas 1', expected: 'cas 1' },
  { input: 'Cas 1 + 2 bis', expected: 'cas mixte' },
  { input: 'Cas 1 et 2 bis', expected: 'cas mixte' },
  { input: 'Cas 4 (AO innovant)', expected: 'cas 4' },
  { input: 'autre', expected: undefined },
];

for (const cas of casÀTester) {
  test(`Pour la valeur en entrée ${cas.input} la valeur retourner doit être ${cas.expected}`, () => {
    expect(mapDétailsToTypeTerrainImplantation(cas.input)).to.equal(cas.expected);
  });
}
