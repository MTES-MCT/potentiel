import { should } from 'chai';
import { after, before, beforeEach, describe, it } from 'node:test';

import { Entity, ListResultV2 } from '@potentiel-domain/core';
import { unflatten } from '@potentiel-librairies/flat-cjs';
import { executeQuery, killPool } from '@potentiel-librairies/pg-helpers';

import { listProjectionV2 } from './listProjectionV2';

should();

describe('listProjectionV2', () => {
  type GestionnaireRéseau = Entity<
    'gestionnaire-réseau',
    {
      data: {
        value: string;
      };
    }
  >;

  let gestionnaires: Array<Omit<GestionnaireRéseau, 'type'>> = [];

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
        },
      });
    }

    for (const gestionnaire of gestionnaires) {
      await executeQuery(
        `insert
        into domain_views.projection
        values ($1, $2)`,
        `gestionnaire-réseau|${gestionnaire.data.value}`,
        gestionnaire,
      );
    }
  });

  it(`
    Etant donnée des projections de type gestionnaire réseau
    Quand je récupére la liste des gestionnaire réseau
    Alors l'ensemble des gestionnaire réseaux est retourné sous la forme d'un résultat
  `, async () => {
    const actual = await listProjectionV2<GestionnaireRéseau>({
      type: 'gestionnaire-réseau',
    });

    const expected: ListResultV2<GestionnaireRéseau> = {
      items: gestionnaires.map((g) => ({
        ...unflatten(g),
        type: 'gestionnaire-réseau',
      })),
    };

    actual.should.be.eql(expected);
  });
});
