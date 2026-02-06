import { test, describe } from 'node:test';

import { expect } from 'chai';

import { normaliserCommune } from './normaliserCommune.js';

describe(normaliserCommune.name, () => {
  const transformations = [
    ['ST LEONARD DE NOBLAT', 'saint leonard de noblat'],
    ['Thiéblemont-Farémont', 'thieblemont faremont'],
    ['L ISLE D ESPAGNAC', "l'isle d'espagnac"],
    ['Perpignan Cedex', 'perpignan'],
    ['Toulouse cedex 9', 'toulouse'],
    ['METZ CEDEX 03', 'metz'],
    ['Saint-Floris', 'saint floris'],
    ['St-Floris', 'saint floris'],
    ['St Floris', 'saint floris'],
    ['st Floris', 'saint floris'],
    ['Sainte Catherine', 'sainte catherine'],
    ['Sainte-Catherine', 'sainte catherine'],
    ['Ste-Catherine', 'sainte catherine'],
    ['Ste Catherine', 'sainte catherine'],
    ['Neuville-St-Vaast', 'neuville saint vaast'],
    ['Neuville-st-Vaast', 'neuville saint vaast'],
    ['Test-Sainte-Catherine', 'test sainte catherine'],
    ['Test-Ste-Catherine', 'test sainte catherine'],
  ];

  for (const [input, expected] of transformations) {
    test(`Transforme ${input} en ${expected}`, () => {
      expect(normaliserCommune(input)).to.eq(expected);
    });
  }
});
