import { should } from 'chai';
import { after, before, beforeEach, describe, it } from 'node:test';

import { Entity, LimitOptions, ListResultV2 } from '@potentiel-domain/core';
import { flatten, unflatten } from '@potentiel-librairies/flat-cjs';
import { executeQuery, killPool } from '@potentiel-librairies/pg-helpers';

import { listProjectionV2 } from './listProjectionV2';

should();

describe('listProjectionV2', () => {
  type FakeProjection = Entity<
    'fake-projection',
    {
      data: {
        value: string;
        name: string;
      };
    }
  >;

  let fakeData: Array<Omit<FakeProjection, 'type'>> = [];

  before(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  after(() => killPool());

  beforeEach(async () => {
    await executeQuery(`delete from domain_views.projection`);

    fakeData = [];

    for (let time = 0; time <= Math.random() * 100 + 10; time++) {
      fakeData.push({
        data: {
          value: `a random value ${time}`,
          name: `${time}`,
        },
      });
    }

    for (const fake of fakeData) {
      await executeQuery(
        `insert
        into domain_views.projection
        values ($1, $2)`,
        `fake-projection|${fake.data.value}`,
        flatten(fake),
      );
    }
  });

  const mapToListResultItems = (
    expectedData: Array<Omit<FakeProjection, 'type'>>,
  ): ListResultV2<FakeProjection> => ({
    total: expectedData.length,
    items: expectedData.map((g) => ({
      ...unflatten(g),
      type: 'fake-projection',
    })),
    limit: {
      next: expectedData.length,
      offset: 0,
    },
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie
    Alors l'ensemble des projections de cette catégorie est retournée sous la forme d'un résultat
  `, async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection');

    const expected = mapToListResultItems(fakeData);

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie en triant par une propriété descendante
    Alors l'ensemble des projections de cette catégorie est retournée sous la forme d'un résultat trié par ordre de nom descendant
  `, async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      orderBy: {
        data: {
          name: 'descending',
          value: 'descending',
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.sort(({ data: { value: a } }, { data: { value: b } }) => b.localeCompare(a)),
    );

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie avec une limite du nombre de ligne retournée
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération la limite
  `, async () => {
    const limit: LimitOptions = {
      offset: 5,
      next: 3,
    };

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      limit,
    });

    const expected = {
      ...mapToListResultItems([fakeData[5], fakeData[6], fakeData[7]]),
      total: fakeData.length,
      limit,
    };

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie avec un filtre strict
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération le filtre strict
  `, async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            operator: 'equal',
            value: '1',
          },
        },
      },
    });

    const expected = mapToListResultItems([fakeData[1]]);

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie avec un filtre strict exclusif
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération le filtre strict exclusif
  `, async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            operator: 'notEqual',
            value: '1',
          },
        },
      },
    });

    const expected = mapToListResultItems(fakeData.filter((g) => g.data.name !== '1'));

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie avec un filtre de recherche insensible à la casse 
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération le filtre de recherche sans sensibilité à la casse
  `, async () => {
    const insensitiveCaseFakeData = {
      data: {
        value: 'a random value',
        name: 'A RANDOM NAME',
      },
    };

    fakeData.push(insensitiveCaseFakeData);

    await executeQuery(
      `insert
        into domain_views.projection
        values ($1, $2)`,
      `fake-projection|${insensitiveCaseFakeData.data.value}`,
      flatten(insensitiveCaseFakeData),
    );

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            operator: 'like',
            value: 'a%',
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter((g) => g.data.name.toLowerCase().startsWith('a')),
    );

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie avec un filtre de recherche insensible à la casse 
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération le filtre de recherche sans sensibilité à la casse
  `, async () => {
    const insensitiveCaseFakeData = {
      data: {
        value: 'a random value',
        name: 'A RANDOM NAME',
      },
    };

    fakeData.push(insensitiveCaseFakeData);

    await executeQuery(
      `insert
        into domain_views.projection
        values ($1, $2)`,
      `fake-projection|${insensitiveCaseFakeData.data.value}`,
      flatten(insensitiveCaseFakeData),
    );

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            operator: 'like',
            value: 'a%',
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter((g) => g.data.name.toLowerCase().startsWith('a')),
    );

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie avec un filtre de recherche insensible à la casse sélectif
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération le filtre de recherche sans sensibilité à la casse sélectif
  `, async () => {
    const insensitiveCaseFakeData = {
      data: {
        value: 'a random value',
        name: 'A RANDOM NAME',
      },
    };

    fakeData.push(insensitiveCaseFakeData);

    await executeQuery(
      `insert
        into domain_views.projection
        values ($1, $2)`,
      `fake-projection|${insensitiveCaseFakeData.data.value}`,
      flatten(insensitiveCaseFakeData),
    );

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            operator: 'notLike',
            value: 'a%',
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter((g) => !g.data.name.toLowerCase().startsWith('a')),
    );

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie dont une valeur est inclue dans une liste des valeurs 
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération l'inclusion de la valeur dans la liste
  `, async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            operator: 'include',
            value: valuesArray,
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter(({ data }) => valuesArray.includes(data.name)),
    );

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie dont une valeur n'est pas incluse dans une liste des valeurs 
    Alors les projections de cette catégorie dont la valeur est non incluse dans la liste sont retournées
  `, async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            operator: 'notInclude',
            value: valuesArray,
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter(({ data }) => !valuesArray.includes(data.name)),
    );

    actual.should.be.deep.equal(expected);
  });
});
