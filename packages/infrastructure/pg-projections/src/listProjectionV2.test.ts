import { should } from 'chai';
import { after, before, beforeEach, describe, it } from 'node:test';

import { Entity, ListResultV2 } from '@potentiel-domain/core';
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

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie
    Alors l'ensemble des projections de cette catégorie est retournée sous la forme d'un résultat
  `, async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection');

    const expected: ListResultV2<FakeProjection> = {
      total: fakeData.length,
      items: fakeData.map((g) => ({
        ...unflatten(g),
        type: 'fake-projection',
      })),
    };

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

    const expected: ListResultV2<FakeProjection> = {
      total: fakeData.length,
      items: fakeData
        .sort(({ data: { value: a } }, { data: { value: b } }) => b.localeCompare(a))
        .map((g) => ({
          ...unflatten(g),
          type: 'fake-projection',
        })),
    };

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie avec une limite du nombre de ligne retournée
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération la limite
  `, async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      limit: {
        offset: 5,
        next: 3,
      },
    });

    const expected: ListResultV2<FakeProjection> = {
      total: fakeData.length,
      items: [fakeData[5], fakeData[6], fakeData[7]].map((g) => ({
        ...unflatten(g),
        type: 'fake-projection',
      })),
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
            type: 'strict',
            value: '1',
          },
        },
      },
    });

    const expected: ListResultV2<FakeProjection> = {
      total: 1,
      items: [fakeData[1]].map((g) => ({
        ...unflatten(g),
        type: 'fake-projection',
      })),
    };

    actual.should.be.deep.equal(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupère la liste des projections par catégorie avec un filtre de recherche
    Alors l'ensemble des projections de cette catégorie est retournée en prenant en considération le filtre de recherche
  `, async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            type: 'like',
            value: '1%',
          },
          value: {
            type: 'like',
            value: '%1',
          },
        },
      },
    });

    const filteredFakes = fakeData.filter(
      (g) => g.data.value.endsWith('1') && g.data.name.startsWith('1'),
    );

    const expected: ListResultV2<FakeProjection> = {
      total: filteredFakes.length,
      items: filteredFakes.map((g) => ({
        ...unflatten(g),
        type: 'fake-projection',
      })),
    };

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
            type: 'ilike',
            value: 'a%',
          },
        },
      },
    });

    const filteredFakes = fakeData.filter((g) => g.data.name.toLowerCase().startsWith('a'));

    const expected: ListResultV2<FakeProjection> = {
      total: filteredFakes.length,
      items: filteredFakes.map((g) => ({
        ...unflatten(g),
        type: 'fake-projection',
      })),
    };

    actual.should.be.deep.equal(expected);
  });
});
