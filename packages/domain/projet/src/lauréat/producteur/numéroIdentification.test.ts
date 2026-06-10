import { describe, it } from 'node:test';

import { expect } from 'chai';

import { isValidLuhn } from './numéroIdentification.valueType.js';

describe('Appliquer la vérification de Luhn sur des numéro SIRET et SIREN', () => {
  describe('SIREN (9 chiffres)', () => {
    it('Doit valider des SIREN corrects', () => {
      const validSiren = ['534721097', '552049447'];

      validSiren.forEach((siren) => {
        expect(isValidLuhn(siren)).to.equal(true);
      });
    });

    it('Doit invalider des SIREN incorrects', () => {
      const invalidSiren = ['732829321', '552100550', '123456789'];

      invalidSiren.forEach((siren) => {
        expect(isValidLuhn(siren)).to.equal(false);
      });
    });
  });

  describe('SIRET (14 chiffres)', () => {
    it('Doit valider des SIRET corrects', () => {
      const validSiret = ['73282932000074', '55210055400013'];

      validSiret.forEach((siret) => {
        expect(isValidLuhn(siret)).to.equal(true);
      });
    });

    it('Doit invalider des SIRET incorrects', () => {
      const invalidSiret = ['73282932000075', '55210055400010', '12345678901234'];

      invalidSiret.forEach((siret) => {
        expect(isValidLuhn(siret)).to.equal(false);
      });
    });
  });

  describe('Cas limites', () => {
    it('Doit invalider si la longueur est incorrecte', () => {
      expect(isValidLuhn('12345678')).to.equal(false);
      expect(isValidLuhn('123456789012345')).to.equal(false);
    });

    it('Doit invalider si contient des caractères non numériques', () => {
      expect(isValidLuhn('73282932A')).to.equal(false);
      expect(isValidLuhn('5521005540001A')).to.equal(false);
    });
  });
});
