import { describe, it } from 'node:test';

import { expect } from 'chai';

import { checkAllowedCallbackURL } from './callbackURLSchema.schema';

describe('checkAllowedCallbackURL', () => {
  const allowedBaseURL = 'http://localhost:3000';

  it('Cas nominal, avec des URLs valides', () => {
    expect(checkAllowedCallbackURL(allowedBaseURL), '/laureats').to.equal(true);
    expect(checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}`)).to.equal(true);
    expect(checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}/laureats`)).to.equal(true);
  });
  it('Cas nominal, sans callbackURL', () => {
    expect(checkAllowedCallbackURL(allowedBaseURL, '')).to.equal(true);
    expect(checkAllowedCallbackURL(allowedBaseURL, undefined)).to.equal(true);
  });
  it("Renvoie false en cas d'URL malveillantes", () => {
    expect(checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}@https://evil.com`)).to.equal(
      false,
    );
    expect(checkAllowedCallbackURL(allowedBaseURL, `https://evil.com`)).to.equal(false);
  });
});
