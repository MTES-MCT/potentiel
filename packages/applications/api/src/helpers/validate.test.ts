import { describe, it } from 'node:test';

import { expect } from 'chai';

import { createSchemaValidator } from './validate.js';

const testSchema = {
  Transmettre: {
    type: 'object',
    required: ['dateMiseEnService'],
    properties: { dateMiseEnService: { type: 'string', format: 'date' } },
  },
  Modifier: {
    type: 'object',
    required: ['nouvelleReference'],
    properties: {
      nouvelleReference: { type: 'string', minLength: 1 },
    },
  },
};

const validate = createSchemaValidator(testSchema);

describe('validate API schemas', () => {
  describe('text field', () => {
    it('should pass on valid body', () => {
      const actual = validate('Modifier', {
        nouvelleReference: 'REF-12345',
      });
      expect(actual).to.deep.equal({ nouvelleReference: 'REF-12345' });
    });
    it('should throw on missing required field', () => {
      expect(() => validate('Modifier', {})).to.throw(
        `Validation failed: must have required property 'nouvelleReference'`,
      );
    });
    it('should throw on empty field', () => {
      expect(() =>
        validate('Modifier', {
          nouvelleReference: '',
        }),
      ).to.throw(`Validation failed (/nouvelleReference): must NOT have fewer than 1 characters`);
    });
  });

  describe('date field', () => {
    it('should pass on valid body', () => {
      const actual = validate('Transmettre', {
        dateMiseEnService: '2025-12-31',
      });
      expect(actual).to.deep.equal({ dateMiseEnService: '2025-12-31' });
    });
    it('should throw on missing required field', () => {
      expect(() => validate('Transmettre', {})).to.throw(
        `Validation failed: must have required property 'dateMiseEnService'`,
      );
    });
    it('should throw on empty field', () => {
      expect(() =>
        validate('Transmettre', {
          dateMiseEnService: '',
        }),
      ).to.throw(`Validation failed (/dateMiseEnService): must match format "date"`);
    });
    it('should throw on invalid date', () => {
      expect(() =>
        validate('Transmettre', {
          dateMiseEnService: 'ABCD-EF-GH',
        }),
      ).to.throw(`Validation failed (/dateMiseEnService): must match format "date"`);
    });
    it('should throw on date+time', () => {
      expect(() =>
        validate('Transmettre', {
          dateMiseEnService: '2025-12-31T12:00:00Z',
        }),
      ).to.throw(`Validation failed (/dateMiseEnService): must match format "date"`);
    });
  });
});
