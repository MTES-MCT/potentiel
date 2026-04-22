import { describe, test } from 'node:test';

import { expect } from 'chai';

import { mapCsvRowToCoordonnées } from './coordonnéesCsv';

describe('mapCsvRowToCoordonnées', () => {
  test('Coordonnées valides présentes', () => {
    const actual = mapCsvRowToCoordonnées({
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)': '47',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)': '22',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (degrés)': '4',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation :Longitude (minutes)': '46',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)': 'N',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude\n(secondes)': '43',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (cardinal)': 'E',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (secondes)': '24',
    });
    expect(actual).to.deep.equal({ latitude: 47.378611, longitude: 4.773333 });
  });

  test('Pas de coordonnées présentes', () => {
    const actual = mapCsvRowToCoordonnées({});
    expect(actual).to.be.undefined;
  });

  test('Coordonnées invalides présentes (degrés)', () => {
    const actual = mapCsvRowToCoordonnées({
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)': '218', // invalide
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)': '22',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (degrés)': '4',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (minutes)': '46',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)': 'N',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)': '43',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (cardinal)': 'E',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (secondes)': '24',
    });
    expect(actual).to.be.undefined;
  });

  test('Coordonnées invalides présentes (type)', () => {
    const actual = mapCsvRowToCoordonnées({
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)': 'ABCD', // invalide
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)': '22',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (degrés)': '4',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (minutes)': '46',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)': 'N',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)': '43',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (cardinal)': 'E',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (secondes)': '24',
    });
    expect(actual).to.be.undefined;
  });

  test('Champ manquant', () => {
    const actual = mapCsvRowToCoordonnées({
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)': '22',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (degrés)': '4',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (minutes)': '46',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)': 'N',
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)': '43',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (cardinal)': 'E',
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude (secondes)': '24',
    });
    expect(actual).to.be.undefined;
  });
});
