import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { Projection } from '@potentiel-libraries/projection';
import { listProjection } from './listProjection';

describe(`listProjection`, () => {
  type ProjectionReadModel = Projection<'projection', { target: string; autreTarget?: string }>;

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  afterAll(() => killPool());

  beforeEach(() => executeQuery(`delete from domain_views.projection`));

  it(`Étant donné 20 projections
      Lorsqu'on liste toutes les projections
      Alors tous les éléments devraient être récupérés`, async () => {
    // Arrange
    for (let time = 1; time <= 20; time++) {
      await executeQuery(
        `insert
            into domain_views.projection
            values ($1, $2)`,
        `projection|random-${time}`,
        { type: 'projection', target: `a random value ${time}` },
      );
    }

    // Act
    const result = await listProjection<ProjectionReadModel>({
      type: 'projection',
    });

    // Assert
    expect(result.items).toHaveLength(20);
    expect(result).toEqual({
      currentPage: 1,
      itemsPerPage: 20,
      totalItems: 20,
      items: expect.any(Array),
    });
  });

  describe(`filtering`, () => {
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
      expect(result.items).toHaveLength(1);
      expect(result.items).toContainEqual({
        type: 'projection',
        target: 'yes',
      });
    });
    it(`Étant donné plusieurs projections dont une seule avec dans son payload la propriété "target" contenant la valeur "yes" et la propriété "autreTarget" contenant la propriété "ok"
      Lorsqu'on liste les projections en filtrant celle avec la propriété "target" avec la valeur "yes" et la propriété "autreTarget" avec la valeur "ok"
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
        { type: 'projection', target: 'yes', autreTarget: 'a randome value' },
      );

      await executeQuery(
        `insert 
       into domain_views.projection
       values ($1, $2)`,
        'projection|the-expected-one',
        { type: 'projection', target: 'yes', autreTarget: 'ok' },
      );

      // Act
      const result = await listProjection<ProjectionReadModel>({
        type: 'projection',
        where: {
          target: 'yes',
          autreTarget: 'ok',
        },
      });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items).toContainEqual({
        type: 'projection',
        target: 'yes',
        autreTarget: 'ok',
      });
    });
  });

  describe(`paginate`, () => {
    it(`Étant donné 20 projections
      Lorsqu'on liste les projections pour la 1ère page avec 5 éléments
      Alors les 5 premiers éléments devraient être récupérés`, async () => {
      // Arrange
      for (let time = 1; time <= 20; time++) {
        await executeQuery(
          `insert
            into domain_views.projection
            values ($1, $2)`,
          `projection|random-${time}`,
          { type: 'projection', target: `a random value ${time}` },
        );
      }

      // Act
      const result = await listProjection<ProjectionReadModel>({
        type: 'projection',
        pagination: {
          page: 1,
          itemsPerPage: 5,
        },
      });

      // Assert
      expect(result.items).toHaveLength(5);
      expect(result).toEqual({
        currentPage: 1,
        itemsPerPage: 5,
        totalItems: 20,
        items: [
          {
            type: 'projection',
            target: 'a random value 1',
          },
          {
            type: 'projection',
            target: 'a random value 2',
          },
          {
            type: 'projection',
            target: 'a random value 3',
          },
          {
            type: 'projection',
            target: 'a random value 4',
          },
          {
            type: 'projection',
            target: 'a random value 5',
          },
        ],
      });
    });

    it(`Étant donné 20 projections
      Lorsqu'on liste les projections pour la 2ème page avec 5 éléments
      Alors 5 éléments pour la page 2 devraient être récupérés`, async () => {
      // Arrange
      for (let time = 1; time <= 20; time++) {
        await executeQuery(
          `insert
            into domain_views.projection
            values ($1, $2)`,
          `projection|random-${time}`,
          { type: 'projection', target: `a random value ${time}` },
        );
      }

      // Act
      const result = await listProjection<ProjectionReadModel>({
        type: 'projection',
        pagination: {
          page: 2,
          itemsPerPage: 5,
        },
      });

      // Assert
      expect(result.items).toHaveLength(5);
      expect(result).toEqual({
        currentPage: 2,
        itemsPerPage: 5,
        totalItems: 20,
        items: [
          {
            type: 'projection',
            target: 'a random value 6',
          },
          {
            type: 'projection',
            target: 'a random value 7',
          },
          {
            type: 'projection',
            target: 'a random value 8',
          },
          {
            type: 'projection',
            target: 'a random value 9',
          },
          {
            type: 'projection',
            target: 'a random value 10',
          },
        ],
      });
    });
  });

  describe(`ordering`, () => {
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
        orderBy: {
          property: 'target',
          ascending: true,
        },
      });

      // Assert
      expect(result.items).toEqual([
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
});
