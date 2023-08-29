import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { ReadModel } from '@potentiel/core-domain';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { listProjection } from './listProjection';

describe(`listProjection`, () => {
  type ProjectionReadModel = ReadModel<'projection', { target: string }>;

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  afterAll(() => killPool());

  beforeEach(() => executeQuery(`delete from domain_views.projection`));

  it(`Étant donné plusieurs projections dont une seule avec dans son payload la propriété "target" contenant la valeur "yes"
      Lorsqu'on liste les projections en filtrant celle avec la propriété "target" avec la valeur "yes"
      Alors un seul résultat devrait être récupéré`, async () => {
    // Arrange
    await executeQuery(
      `insert 
       into domain_views.projection
       values ($1, $2)`,
      'projection|another-one',
      { type: 'projection', target: 'a random value' },
    );
    await executeQuery(
      `insert 
       into domain_views.projection
       values ($1, $2)`,
      'projection|another-one-2',
      { type: 'projection', target: 'a random value' },
    );

    await executeQuery(
      `insert 
       into domain_views.projection
       values ($1, $2)`,
      'projection|the-expected-one',
      { type: 'projection', target: 'yes' },
    );

    // Act
    const result = await listProjection<ProjectionReadModel>({
      type: 'projection',
      where: {
        target: 'yes',
      },
    });

    // Assert
    expect(result).toHaveLength(1);
    expect(result).toContainEqual({
      type: 'projection',
      target: 'yes',
    });
  });

  it(`Lorsqu'on liste les projections avec un ordre
      Alors la liste devrait être ordonnée`, async () => {
    // Arrange
    await executeQuery(
      `insert 
       into domain_views.projection
       values ($1, $2)`,
      'projection|another-one',
      { type: 'projection', target: 'B' },
    );
    await executeQuery(
      `insert 
       into domain_views.projection
       values ($1, $2)`,
      'projection|another-one-2',
      { type: 'projection', target: 'C' },
    );

    await executeQuery(
      `insert 
       into domain_views.projection
       values ($1, $2)`,
      'projection|the-expected-one',
      { type: 'projection', target: 'A' },
    );

    // Act
    const result = await listProjection<ProjectionReadModel>({
      type: 'projection',
      orderBy: 'target',
    });

    // Assert
    expect(result).toEqual([
      {
        type: 'projection',
        target: 'A',
      },
      {
        type: 'projection',
        target: 'B',
      },
      {
        type: 'projection',
        target: 'C',
      },
    ]);
  });
});
