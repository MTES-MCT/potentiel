import { describe, it } from 'node:test';

import { expect } from 'chai';

import { checkAllowedCallbackURL } from './callbackURLSchema.schema';

describe('checkAllowedCallbackURL', () => {
  const allowedBaseURL = 'http://localhost:3000';

  it('Cas nominal, avec des URLs valides', () => {
    expect(checkAllowedCallbackURL('/laureats', allowedBaseURL)).to.equal(true);
    expect(checkAllowedCallbackURL(`${allowedBaseURL}`, allowedBaseURL)).to.equal(true);
    expect(checkAllowedCallbackURL(`${allowedBaseURL}/laureats`, allowedBaseURL)).to.equal(true);
  });
  it('Cas nominal, sans callbackURL', () => {
    expect(checkAllowedCallbackURL('', allowedBaseURL)).to.equal(true);
  });
  it("Renvoie false en cas d'URL malveillantes", () => {
    expect(checkAllowedCallbackURL(`${allowedBaseURL}@https://evil.com`, allowedBaseURL)).to.equal(
      false,
    );
    expect(checkAllowedCallbackURL(`https://evil.com`, allowedBaseURL)).to.equal(false);
  });
});
