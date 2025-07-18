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

    const fixtures = [
      {
        date: '2024-12-01T00:00:00.000Z',
        nombreDeMois: 1,
        expected: '2025-01-01T00:00:00.000Z',
      },
      {
        date: '2024-02-29T00:00:00.000Z',
        nombreDeMois: 1,
        expected: '2024-03-29T00:00:00.000Z',
      },
      {
        date: '2020-02-29T00:00:00.000Z',
        nombreDeMois: 56,
        expected: '2024-10-29T00:00:00.000Z',
      },
      {
        date: '2023-04-21T00:00:00.000Z',
        nombreDeMois: 46,
        expected: '2027-02-21T00:00:00.000Z',
      },
    ];
    fixtures.map((fixture) => {
      it('should add correctly months to a date', () => {
        const date = DateTime.convertirEnValueType(fixture.date);

        const actual = date.ajouterNombreDeMois(fixture.nombreDeMois);

        const expected = DateTime.convertirEnValueType(fixture.expected).formatter();
        expect(actual.formatter()).to.equal(expected);
      });
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
