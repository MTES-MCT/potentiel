import test from 'node:test';

import { expect } from 'chai';

import * as Coordonnées from './coordonnées.valueType.js';

test('Coordonnées.bind et formatter convertissent en DMS', () => {
  const actual = Coordonnées.bind({ latitude: 43.2965, longitude: 5.3698 });

  expect(actual.formatter()).to.equal(`43° 17' 47.4" N, 5° 22' 11.28" E`);
});

test('Coordonnées.convertirEnValueType et formatterDecimal convertissent une chaîne DMS avec espaces en coordonnées décimales', () => {
  const actual = Coordonnées.convertirEnValueType(`43° 17' 47.4" N, 5° 22' 11.28" E`);

  expect(actual.formatterDecimal()).to.deep.equal({
    latitude: 43.2965,
    longitude: 5.3698,
  });
});

test('Coordonnées.convertirEnValueType et formatterDecimal convertissent une chaîne DMS sans espaces en coordonnées décimales', () => {
  const actual = Coordonnées.convertirEnValueType(`43°17'47.4"N,5°22'11.28"E`);

  expect(actual.formatterDecimal()).to.deep.equal({
    latitude: 43.2965,
    longitude: 5.3698,
  });
});

test.only('Coordonnées.convertirEnValueType et formatterDecimal convertissent une chaîne DMS sans précision en coordonnées décimales', () => {
  const actual = Coordonnées.convertirEnValueType(`43°17'47"N,5°22'11"E`);

  expect(actual.formatterDecimal()).to.deep.equal({
    latitude: 43.296389,
    longitude: 5.369722,
  });
});

test('Coordonnées.estÉgaleÀ compare latitude et longitude', () => {
  const coordonnées = Coordonnées.bind({ latitude: 43.2965, longitude: 5.3698 });

  expect(
    coordonnées.estÉgaleÀ(Coordonnées.bind({ latitude: 43.2965, longitude: 5.3698 })),
  ).to.equal(true);
  expect(coordonnées.estÉgaleÀ(Coordonnées.bind({ latitude: 43.2965, longitude: 5.37 }))).to.equal(
    false,
  );
  expect(
    coordonnées.estÉgaleÀ(Coordonnées.bind({ latitude: 43.2966, longitude: 5.3698 })),
  ).to.equal(false);
});
