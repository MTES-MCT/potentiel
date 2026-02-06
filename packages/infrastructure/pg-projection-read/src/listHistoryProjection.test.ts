import { randomUUID } from 'node:crypto';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { should } from 'chai';
import { faker } from '@faker-js/faker';

import { HistoryRecord, ListHistoryResult } from '@potentiel-domain/entity';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import { listHistoryProjection } from './listHistoryProjection.js';

should();

describe('listHistoryProjection', () => {
  let category = '';
  let id = '';

  let fakeDataWithCategory: Array<HistoryRecord> = [];
  let fakeDataWithId: Array<HistoryRecord> = [];
  let fakeDataWithCategoryAndId: Array<HistoryRecord> = [];
  let fakeData: Array<HistoryRecord> = [];

  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery('delete from domain_views.history');

    category = randomUUID();
    id = randomUUID();
    fakeDataWithCategory = [];
    fakeDataWithId = [];
    fakeDataWithCategoryAndId = [];
    fakeData = [];

    for (let time = 0; time <= Math.random() * 100 + 10; time++) {
      fakeDataWithCategory.push({
        category,
        id: randomUUID(),
        createdAt: faker.date.anytime().toISOString(),
        payload: {
          test: randomUUID(),
        },
        type: randomUUID(),
      });
    }

    for (let time = 0; time <= Math.random() * 100 + 10; time++) {
      fakeDataWithId.push({
        category: randomUUID(),
        id,
        createdAt: faker.date.anytime().toISOString(),
        payload: {
          test: randomUUID(),
        },
        type: randomUUID(),
      });
    }

    for (let time = 0; time <= Math.random() * 100 + 10; time++) {
      fakeDataWithCategoryAndId.push({
        category,
        id,
        createdAt: faker.date.anytime().toISOString(),
        payload: {
          test: randomUUID(),
        },
        type: randomUUID(),
      });
    }

    for (let time = 0; time <= Math.random() * 100 + 10; time++) {
      fakeData.push({
        category: randomUUID(),
        id: randomUUID(),
        createdAt: faker.date.anytime().toISOString(),
        payload: {
          test: randomUUID(),
        },
        type: randomUUID(),
      });
    }

    fakeData.push(...fakeDataWithCategory, ...fakeDataWithId, ...fakeDataWithCategoryAndId);

    await Promise.all(
      fakeData.map(({ category, createdAt, id, payload, type }) =>
        executeQuery(
          `insert
        into domain_views.history
        values ($1, $2, $3, $4, $5)`,
          category,
          id,
          createdAt,
          type,
          payload,
        ),
      ),
    );
  });

  afterEach(async () => {
    await executeQuery('delete from domain_views.history');
  });

  const mapToListResultItems = (
    expectedData: Array<HistoryRecord>,
  ): ListHistoryResult<HistoryRecord> => {
    const items = expectedData.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      total: items.length,
      items,
      range: {
        endPosition: items.length,
        startPosition: 0,
      },
    };
  };

  it('should find history records ordered by created_at', async () => {
    const actual = await listHistoryProjection({});

    const expected = mapToListResultItems(fakeData);

    actual.should.be.deep.equal(expected);
  });

  it('should find history records by category ordered by created_at', async () => {
    const actual = await listHistoryProjection({
      category,
    });

    const expected = mapToListResultItems([
      ...fakeDataWithCategory,
      ...fakeDataWithCategoryAndId.filter((record) => record.category === category),
    ]);

    actual.should.be.deep.equal(expected);
  });

  it('should find history records by id', async () => {
    const actual = await listHistoryProjection({
      id,
    });

    const expected = mapToListResultItems([
      ...fakeDataWithId,
      ...fakeDataWithCategoryAndId.filter((record) => record.id === id),
    ]);

    actual.should.be.deep.equal(expected);
  });

  it('should find history records by id and category', async () => {
    const actual = await listHistoryProjection({
      category,
      id,
    });

    const expected = mapToListResultItems(fakeDataWithCategoryAndId);

    actual.should.be.deep.equal(expected);
  });
});
