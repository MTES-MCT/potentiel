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
    // encodées
    expect(checkAllowedCallbackURL(`${allowedBaseURL}%40evil.com`, allowedBaseURL)).to.equal(false);
    // sous domaines trompeurs
    expect(checkAllowedCallbackURL(`http://${allowedBaseURL}.evil.com/`, allowedBaseURL)).to.equal(
      false,
    );
    // port suspect
    expect(checkAllowedCallbackURL(`${allowedBaseURL}:8080@evil.com/`, allowedBaseURL)).to.equal(
      false,
    );
    // chemin relatif
    expect(checkAllowedCallbackURL(`${allowedBaseURL}/../../evil.com`, allowedBaseURL)).to.equal(
      false,
    );
    // caractères invisibles
    expect(checkAllowedCallbackURL(`${allowedBaseURL}\u200B@evil.com`, allowedBaseURL)).to.equal(
      false,
    );
  });
});
