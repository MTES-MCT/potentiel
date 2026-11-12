import { describe, it } from 'node:test';

import { expect } from 'chai';

import { normalizeTextArea } from './normalizeTextArea';

describe('normalizeTextArea', () => {
  describe('Whitespaces', () => {
    it('trims leading and trailing whitespaces', () => {
      expect(normalizeTextArea('   texte   ')).to.equal('texte');
    });

    it('collapses multiple spaces into one', () => {
      expect(normalizeTextArea('un    texte   espacé')).to.equal('un texte espacé');
    });

    it('replaces tabs with a space', () => {
      expect(normalizeTextArea('un\t\ttexte')).to.equal('un texte');
    });

    it('replaces non-breaking spaces with a space', () => {
      expect(normalizeTextArea('un\u00A0texte\u202Fici')).to.equal('un texte ici');
    });

    it('removes invisible characters', () => {
      expect(normalizeTextArea('\uFEFFun\u200Btexte')).to.equal('untexte');
    });
  });

  describe('Line breaks', () => {
    it('replaces a single line break with a space', () => {
      expect(normalizeTextArea('une phrase coupée\nau milieu')).to.equal(
        'une phrase coupée au milieu',
      );
    });

    it('handles Windows line breaks', () => {
      expect(normalizeTextArea('ligne 1\r\nligne 2\r\n\r\nparagraphe 2')).to.equal(
        'ligne 1 ligne 2 paragraphe 2',
      );
    });

    it('replaces multiple line breaks with a single space', () => {
      expect(normalizeTextArea('paragraphe 1\n\n\n\n  \n\nparagraphe 2')).to.equal(
        'paragraphe 1 paragraphe 2',
      );
    });

    it('removes whitespaces around line breaks', () => {
      expect(normalizeTextArea('  ligne 1  \n   ligne 2  ')).to.equal('ligne 1 ligne 2');
    });
  });

  it('returns an empty string for a whitespace-only text', () => {
    expect(normalizeTextArea(' \n\t\n\u00A0 ')).to.equal('');
  });
});
