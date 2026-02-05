import { after, afterEach, before, beforeEach, describe, test } from 'node:test';
import { randomUUID } from 'node:crypto';

import { expect } from 'chai';
import { flatten } from 'flat';

import { Entity } from '@potentiel-domain/entity';
import { killPool, executeQuery } from '@potentiel-libraries/pg-helpers';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

import { updateManyProjections } from './updateManyProjections.js';

describe('updateManyProjections', () => {
  let category = '';

  type TestEntity = Entity<
    typeof category,
    {
      id: number;
      foo: string;
      bar: number;
      baz: boolean;
    }
  >;
  const fakeData1: Omit<TestEntity, 'type'> = {
    id: 1,
    foo: 'foo1',
    bar: 1,
    baz: true,
  };
  const fakeData2: Omit<TestEntity, 'type'> = {
    id: 2,
    foo: 'foo1',
    bar: 2,
    baz: true,
  };
  const fakeData3: Omit<TestEntity, 'type'> = {
    id: 3,
    foo: 'foo2',
    bar: -1,
    baz: false,
  };

  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    category = randomUUID();

    await executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category}|${fakeData1.id}`,
      flatten(fakeData1),
    );
    await executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category}|${fakeData2.id}`,
      flatten(fakeData2),
    );
    await executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category}|${fakeData3.id}`,
      flatten(fakeData3),
    );
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
  });

  test('single key', async () => {
    const expected = [
      { ...fakeData1, type: category, bar: 8 },
      { ...fakeData2, type: category, bar: 8 },
      { ...fakeData3, type: category },
    ];
    await updateManyProjections<TestEntity>(
      category,
      { foo: { operator: 'equal', value: 'foo1' } },
      { bar: 8 },
    );
    const results = await listProjection<TestEntity>(category, { orderBy: { id: 'ascending' } });

    expect(results.items).to.deep.eq(expected);
  });

  test('multiple keys', async () => {
    const expected = [
      { ...fakeData1, type: category, foo: 'hello', bar: 9 },
      { ...fakeData2, type: category, foo: 'hello', bar: 9 },
      { ...fakeData3, type: category },
    ];
    await updateManyProjections<TestEntity>(
      category,
      { foo: { operator: 'equal', value: 'foo1' } },
      { foo: expected[0].foo, bar: expected[0].bar },
    );

    const results = await listProjection<TestEntity>(category, { orderBy: { id: 'ascending' } });

    expect(results.items).to.deep.eq(expected);
  });
});
