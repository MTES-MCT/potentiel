import { test } from 'node:test';

import { expect } from 'chai';

import { toCSV } from './toCSV';

test(`Étant donné des données à exporter en CSV
  Quand on transforme les données en CSV
  Alors le contenu du CSV doit correspondre au contenu transformé`, async () => {
  const data = [
    {
      props1: 'A',
      props2: 'B',
    },
    {
      props1: 'C',
      props2: 'D',
    },
  ];
  const csv = await toCSV({ data, fields: ['props1', 'props2'] });

  const expected = `"props1";"props2"\n"A";"B"\n"C";"D"`;

  expect(csv.trim()).to.eq(expected);
});

test(`Étant donné des données à exporter en CSV
  Quand on transforme les données en CSV en ne sélectionnant que certains champs
  Alors le contenu du CSV doit se baser sur les champs séléctionnés`, async () => {
  const data = [
    {
      props1: 'A',
      props2: 'B',
    },
    {
      props1: 'C',
      props2: 'D',
    },
    {
      props2: 'E',
      props3: 'F',
    },
  ];
  const csv = await toCSV({ data, fields: [{ label: 'Props 1', value: 'props1' }] });

  const expected = `"Props 1"\n"A"\n"C"`;

  expect(csv.trim()).to.eq(expected);
});
