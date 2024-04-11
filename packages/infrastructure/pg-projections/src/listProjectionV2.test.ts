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

  let gestionnaires: Array<Omit<FakeProjection, 'type'>> = [];

  before(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  after(() => killPool());

  beforeEach(async () => {
    await executeQuery(`delete from domain_views.projection`);

    gestionnaires = [];

    for (let time = 0; time <= Math.random() * 100; time++) {
      gestionnaires.push({
        data: {
          value: `a random value ${time}`,
          name: `${time}`,
        },
      });
    }

    for (const gestionnaire of gestionnaires) {
      await executeQuery(
        `insert
        into domain_views.projection
        values ($1, $2)`,
        `fake-projection|${gestionnaire.data.value}`,
        flatten(gestionnaire),
      );
    }
  });

  it(`
    Etant donnée des projections
    Quand je récupére la liste des projections par category
    Alors l'ensemble des projections de cette category est retournée sous la forme d'un résultat
  `, async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection');

    const expected: ListResultV2<FakeProjection> = {
      items: gestionnaires.map((g) => ({
        ...unflatten(g),
        type: 'fake-projection',
      })),
    };

    actual.should.be.eql(expected);
  });

  it(`
    Etant donnée des projections
    Quand je récupére la liste des projections par category en triant par une propriété descendante
    Alors l'ensemble des projections de cette category est retournée sous la forme d'un résultat trié par ordre de nom descendant
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
      items: gestionnaires
        .sort(({ data: { value: a } }, { data: { value: b } }) => b.localeCompare(a))
        .map((g) => ({
          ...unflatten(g),
          type: 'fake-projection',
        })),
    };

    actual.should.be.eql(expected);
  });
});
