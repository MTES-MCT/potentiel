import { test } from 'node:test';

import { expect } from 'chai';

import { chiffrerIdentifiantProjet, déchiffrerIdentifiantProjet, generateIV } from './chiffrement';

test('chiffrer et déchiffrer identifiantProjet', () => {
  const identifiantProjet = '1234567890';
  const iv = generateIV();
  const identifiantProjetChiffré = chiffrerIdentifiantProjet(identifiantProjet, iv);
  const identifiantProjetDéchiffré = déchiffrerIdentifiantProjet(identifiantProjetChiffré, iv);
  expect(identifiantProjetDéchiffré).to.eq(identifiantProjet);
});
