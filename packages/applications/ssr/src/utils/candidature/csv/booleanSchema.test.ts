import { describe, it } from 'node:test';

import { expect } from 'chai';

import { booleanSchema } from '../schemaBase';

import { optionalOuiNonVideSchema } from './commonCsv.schema';

describe('booleanSchema', () => {
  it('supports boolean values', () => {
    expect(booleanSchema.parse(true)).to.equal(true);
    expect(booleanSchema.parse(false)).to.equal(false);
  });

  it('supports oui/non values', () => {
    expect(booleanSchema.parse('oui')).to.equal(true);
    expect(booleanSchema.parse('non')).to.equal(false);
    expect(booleanSchema.parse('OUI')).to.equal(true);
    expect(booleanSchema.parse('NON')).to.equal(false);
    expect(booleanSchema.parse('Oui')).to.equal(true);
    expect(booleanSchema.parse('Non')).to.equal(false);
  });

  it('supports true/false values', () => {
    expect(booleanSchema.parse('true')).to.equal(true);
    expect(booleanSchema.parse('false')).to.equal(false);
    expect(booleanSchema.parse('TRUE')).to.equal(true);
    expect(booleanSchema.parse('False')).to.equal(false);
    expect(booleanSchema.parse('True')).to.equal(true);
    expect(booleanSchema.parse('False')).to.equal(false);
  });
});

describe('optionalOuiNonVideSchema', () => {
  it('supports oui/non values', () => {
    expect(optionalOuiNonVideSchema.parse('oui')).to.equal(true);
    expect(optionalOuiNonVideSchema.parse('non')).to.equal(false);
    expect(optionalOuiNonVideSchema.parse('OUI')).to.equal(true);
    expect(optionalOuiNonVideSchema.parse('NON')).to.equal(false);
    expect(optionalOuiNonVideSchema.parse('Oui')).to.equal(true);
    expect(optionalOuiNonVideSchema.parse('Non')).to.equal(false);
  });

  it('supports true/false values', () => {
    expect(optionalOuiNonVideSchema.parse('true')).to.equal(true);
    expect(optionalOuiNonVideSchema.parse('false')).to.equal(false);
    expect(optionalOuiNonVideSchema.parse('TRUE')).to.equal(true);
    expect(optionalOuiNonVideSchema.parse('False')).to.equal(false);
    expect(optionalOuiNonVideSchema.parse('True')).to.equal(true);
    expect(optionalOuiNonVideSchema.parse('False')).to.equal(false);
  });

  it('returns undefined when no value is provided', () => {
    expect(optionalOuiNonVideSchema.parse(undefined)).to.equal(undefined);
  });

  it('returns undefined when an empty string is provided', () => {
    expect(optionalOuiNonVideSchema.parse('')).to.equal(undefined);
  });

  describe('with default false', () => {
    it('returns undefined when no value is provided', () => {
      expect(optionalOuiNonVideSchema.default(false).parse(undefined)).to.equal(false);
    });

    it('returns undefined when an empty string is provided', () => {
      expect(optionalOuiNonVideSchema.default(false).parse('')).to.equal(false);
    });
  });
});
