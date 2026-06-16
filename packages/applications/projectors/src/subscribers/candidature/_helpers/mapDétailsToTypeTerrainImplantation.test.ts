import test from 'node:test';

import { expect } from 'chai';

import { mapDétailsToTypeTerrainImplantation } from './mapDétailsToTypeTerrainImplantation.js';

const testCases = [
  { input: 'cas 1', expected: 'cas 1' },
  { input: 'Cas 1', expected: 'cas 1' },
  { input: 'Cas 2 bis', expected: 'cas 2 bis' },
  { input: 'Cas 1 + 2 bis', expected: 'cas mixte' },
  { input: '2 bis', expected: 'cas 2 bis' },
  { input: 'Cas 4 (AO innovant)', expected: 'cas 4' },
  { input: '1', expected: 'cas 1' },
  { input: '2 et 3', expected: 'cas mixte' },
  { input: 'autre', expected: undefined },
  { input: 'cas', expected: undefined },
];

test("Retourner le type de terrain d'implantation formatté", () => {
  testCases.forEach(({ input, expected }) => {
    expect(mapDétailsToTypeTerrainImplantation(input)).to.deep.equal(expected);
  });
});
