import { describe, it } from 'node:test';

import { expect } from 'chai';

import { checkAllowedCallbackURL } from './callbackURLSchema.schema';

describe('checkAllowedCallbackURL', () => {
  const allowedBaseURL = 'http://localhost:3000';

  describe('Cas nominal', () => {
    it('URL absolue, racine', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}`)).to.equal(true);
    });

    it('URL absolue, avec path', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}/laureats`)).to.equal(true);
    });

    it('vide', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, '')).to.equal(true);
    });

    it('undefined', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, undefined)).to.equal(true);
    });
  });

  describe("Renvoie false en cas d'URL relative", () => {
    it('URL relative', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, '/laureats')).to.equal(false);
    });
  });

  describe("Renvoie false en cas d'URL malveillantes", () => {
    it('contient arobase', () => {
      expect(
        checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}@https://evil.com`),
      ).to.equal(false);
    });
    it('url non autorisées', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, `https://evil.com`)).to.equal(false);
    });
    it('double slash', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, `//https://evil.com`)).to.equal(false);
    });
    it('encodées', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}%40evil.com`)).to.equal(
        false,
      );
    });
    it('sous domaines trompeurs', () => {
      expect(
        checkAllowedCallbackURL(allowedBaseURL, `http://${allowedBaseURL}.evil.com/`),
      ).to.equal(false);
    });
    it('port suspect', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}:8080@evil.com/`)).to.equal(
        false,
      );
    });
    it('caractères invisibles', () => {
      expect(checkAllowedCallbackURL(allowedBaseURL, `${allowedBaseURL}\u200B@evil.com`)).to.equal(
        false,
      );
    });
  });
});
