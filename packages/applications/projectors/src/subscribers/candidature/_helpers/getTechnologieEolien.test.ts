import test from 'node:test';

import { expect } from 'chai';

import { getTechnologieEolien } from './getTechnologieEolien.js';

const casÀTester = [
  { input: 'Synchrone', output: 'synchrone' },
  { input: 'Asynchrone', output: 'asynchrone' },
  { input: 'Eolienne à entraînement direct', output: 'synchrone' },
  { input: 'Eoliennes à axe horizontal - Entrainement indirect', output: 'asynchrone' },
  { input: 'Éoliennes axe horizontal, sans entraînement direct', output: 'asynchrone' },
  { input: 'Turbine asynchrone (entrainement non direct)', output: 'asynchrone' },
  { input: 'Eolienne à axe horizontal, à entraînement direct ou indirect', output: undefined },
  { input: 'Axe horizontal - Multiplicateur', output: undefined },
];

for (const cas of casÀTester) {
  test(`${cas.input} doit retourner ${cas.output}`, () => {
    expect(getTechnologieEolien(cas.input)).to.deep.equal(cas.output);
  });
}
