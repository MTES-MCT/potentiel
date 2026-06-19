import test from 'node:test';

import { expect } from 'chai';

import { getTechnologieEolien } from './getTechnologieEolien.js';

const casÀTester = [
  { inupt: 'Synchrone', output: 'synchrone' },
  { inupt: 'Asynchrone', output: 'asynchrone' },
  { inupt: 'Eolienne à entraînement direct', output: 'synchrone' },
  { inupt: 'Eoliennes à axe horizontal - Entrainement indirect', output: 'asynchrone' },
  { inupt: 'Éoliennes axe horizontal, sans entraînement direct', output: 'asynchrone' },
  { inupt: 'Turbine asynchrone (entrainement non direct)', output: 'asynchrone' },
  { inupt: 'Eolienne à axe horizontal, à entraînement direct ou indirect', output: undefined },
  { inupt: 'Axe horizontal - Multiplicateur', output: undefined },
];

for (const cas of casÀTester) {
  test(`${cas.inupt} doit retourner ${cas.output}`, () => {
    expect(getTechnologieEolien(cas.inupt)).to.deep.equal(cas.output);
  });
}
