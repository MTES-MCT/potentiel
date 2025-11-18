import { describe, it } from 'node:test';

import { expect } from 'chai';

import { assertError } from '../../candidature/csv/_test-shared';

import { callbackURLSchema } from './callbackURLSchema.schema';

const allowedBaseURL = process.env.BASE_URL ?? '__MISSING__';

describe('callbackURLSchema', () => {
  it('Cas nominal, avec des URLs valides', () => {
    expect(callbackURLSchema.parse('/laureats')).to.equal(`/laureats`);
    expect(callbackURLSchema.parse(`${allowedBaseURL}`)).to.equal(`${allowedBaseURL}`);
    expect(callbackURLSchema.parse(`${allowedBaseURL}/laureats`)).to.equal(
      `${allowedBaseURL}/laureats`,
    );
  });
  it('Cas nominal, sans callbackURL', () => {
    expect(callbackURLSchema.parse(undefined)).to.equal(undefined);
  });
  it("Renvoie une erreur en cas d'URL malveillantes", () => {
    const result = callbackURLSchema.safeParse(`${allowedBaseURL}/@coucou.com`);
    assertError(result, [], "L'URL de redirection n'est pas valide");
  });
});
