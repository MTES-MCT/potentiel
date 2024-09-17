import { describe, it } from 'node:test';

import { expect } from 'chai';

import { DateTime } from '..';

describe('DateTime', () => {
  describe('ajouterNombreDeJours', () => {
    it('is pure', () => {
      const date = DateTime.convertirEnValueType('2024-12-01T00:00:00.000Z');
      expect(date.ajouterNombreDeJours(1).formatter()).to.eq('2024-12-02T00:00:00.000Z');
      expect(date.ajouterNombreDeJours(1).formatter()).to.eq('2024-12-02T00:00:00.000Z');
    });
  });
  describe('retirerNombreDeJours', () => {
    it('is pure', () => {
      const date = DateTime.convertirEnValueType('2024-12-01T00:00:00.000Z');
      expect(date.retirerNombreDeJours(1).formatter()).to.eq('2024-11-30T00:00:00.000Z');
      expect(date.retirerNombreDeJours(1).formatter()).to.eq('2024-11-30T00:00:00.000Z');
    });
  });
  describe('ajouterNombreDeMois', () => {
    it('is pure', () => {
      const date = DateTime.convertirEnValueType('2024-12-01T00:00:00.000Z');
      expect(date.ajouterNombreDeMois(1).formatter()).to.eq('2025-01-01T00:00:00.000Z');
      expect(date.ajouterNombreDeMois(1).formatter()).to.eq('2025-01-01T00:00:00.000Z');
    });
  });
  describe('retirerNombreDeMois', () => {
    it('is pure', () => {
      const date = DateTime.convertirEnValueType('2024-12-01T00:00:00.000Z');
      expect(date.retirerNombreDeMois(1).formatter()).to.eq('2024-11-01T00:00:00.000Z');
      expect(date.retirerNombreDeMois(1).formatter()).to.eq('2024-11-01T00:00:00.000Z');
    });
  });
});
