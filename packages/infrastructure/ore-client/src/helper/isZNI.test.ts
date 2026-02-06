import { test, describe } from 'node:test';

import { expect } from 'chai';

import { isZNI } from './isZNI.js';

const codePostauxAndExpected = [
  ['97100', 'EDF Archipel Guadeloupe'],
  ['97233', 'EDF Martinique'],
  ['97340', 'EDF Guyane'],
  ['97499', 'EDF Réunion'],
  ['97621', 'Electricité de Mayotte'],
  ['20167', 'EDF Corse'],
];

const notMatchingCodePostaux = ['88100', '75000', '04008', '69007'];

describe(isZNI.name, () => {
  describe('Matching code postaux', () => {
    for (const [input, expected] of codePostauxAndExpected) {
      test(`${input} should be matched to raison sociale ${expected}`, () => {
        expect(isZNI(input)).to.eq(true);
      });
    }
  });

  describe('Not matching code postaux', () => {
    for (const codePostal of notMatchingCodePostaux) {
      test(`${codePostal} should not be matched`, () => {
        expect(isZNI(codePostal)).to.eq(false);
      });
    }
  });
});
