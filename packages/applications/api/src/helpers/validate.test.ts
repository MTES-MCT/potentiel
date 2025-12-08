import { describe, it } from 'node:test';

import { expect } from 'chai';

import { validate } from './validate.js';

describe('validate API schemas', () => {
  describe('text field', () => {
    it('should pass on valid body', () => {
      const actual = validate('ModifierReferenceBody', {
        nouvelleReference: 'REF-12345',
      });
      expect(actual).to.deep.equal({ nouvelleReference: 'REF-12345' });
    });
    it('should throw on missing required field', () => {
      expect(() => validate('ModifierReferenceBody', {})).to.throw(
        `Validation failed: must have required property 'nouvelleReference'`,
      );
    });
    it('should throw on empty field', () => {
      expect(() =>
        validate('ModifierReferenceBody', {
          nouvelleReference: '',
        }),
      ).to.throw(`Validation failed (/nouvelleReference): must NOT have fewer than 1 characters`);
    });
  });

  describe('date field', () => {
    it('should pass on valid body', () => {
      const actual = validate('TransmettreDateMiseEnServiceBody', {
        dateMiseEnService: '2025-12-31',
      });
      expect(actual).to.deep.equal({ dateMiseEnService: '2025-12-31' });
    });
    it('should throw on missing required field', () => {
      expect(() => validate('TransmettreDateMiseEnServiceBody', {})).to.throw(
        `Validation failed: must have required property 'dateMiseEnService'`,
      );
    });
    it('should throw on empty field', () => {
      expect(() =>
        validate('TransmettreDateMiseEnServiceBody', {
          dateMiseEnService: '',
        }),
      ).to.throw(`Validation failed (/dateMiseEnService): must match format "date"`);
    });
    it('should throw on invalid date', () => {
      expect(() =>
        validate('TransmettreDateMiseEnServiceBody', {
          dateMiseEnService: 'ABCD-EF-GH',
        }),
      ).to.throw(`Validation failed (/dateMiseEnService): must match format "date"`);
    });
    it('should throw on date+time', () => {
      expect(() =>
        validate('TransmettreDateMiseEnServiceBody', {
          dateMiseEnService: '2025-12-31T12:00:00Z',
        }),
      ).to.throw(`Validation failed (/dateMiseEnService): must match format "date"`);
    });
  });
});
