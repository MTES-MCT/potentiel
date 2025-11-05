import { after, afterEach, before, beforeEach, describe, test } from 'node:test';
import { randomUUID } from 'node:crypto';

import { expect } from 'chai';

import { Entity } from '@potentiel-domain/entity';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { flatten } from '@potentiel-libraries/flat';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

import { updateOneProjection } from './updateOneProjection';

describe('updateOneProjection', () => {
  let category = '';

  type TestEntity = Entity<
    typeof category,
    {
      id: number;
      foo: string;
      bar: number;
      baz: boolean;
      qux?: string;
    }
  >;
  const fakeData1: Omit<TestEntity, 'type'> = {
    id: 1,
    foo: 'foo1',
    bar: 1,
    baz: true,
    qux: 'qux1',
  };
  const fakeData2: Omit<TestEntity, 'type'> = {
    id: 2,
    foo: 'foo2',
    bar: 2,
    baz: true,
    qux: 'qux2',
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
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
  });

  test(`single string key`, async () => {
    const expected = [
      {
        ...fakeData1,
        type: category,
        foo: 'updated foo',
      },
      { ...fakeData2, type: category },
    ];

    await updateOneProjection<TestEntity>(`${category}|1`, { foo: expected[0].foo });

    const results = await listProjection<TestEntity>(category, { orderBy: { id: 'ascending' } });
    expect(results.items).to.deep.eq(expected);
  });

  test(`single number key`, async () => {
    const expected = [
      {
        ...fakeData1,
        type: category,
        bar: 42,
      },
      { ...fakeData2, type: category },
    ];

    await updateOneProjection<TestEntity>(`${category}|1`, { bar: expected[0].bar });

    const results = await listProjection<TestEntity>(category, { orderBy: { id: 'ascending' } });
    expect(results.items).to.deep.eq(expected);
  });

  test(`single boolean key`, async () => {
    const expected = [
      {
        ...fakeData1,
        type: category,
        baz: false,
      },
      { ...fakeData2, type: category },
    ];

    await updateOneProjection<TestEntity>(`${category}|1`, { baz: expected[0].baz });

    const results = await listProjection<TestEntity>(category, { orderBy: { id: 'ascending' } });
    expect(results.items).to.deep.eq(expected);
  });

  test(`single undefined value`, async () => {
    const expected: TestEntity[] = [
      {
        id: 1,
        foo: 'foo1',
        bar: 1,
        baz: true,
        type: category,
      },
      { ...fakeData2, type: category },
    ];
    const key = `${category}|1` as const;
    await updateOneProjection<TestEntity>(key, { qux: undefined });

    const results = await listProjection<TestEntity>(category, { orderBy: { id: 'ascending' } });
    expect(results.items).to.deep.eq(expected);
  });

  test(`multiple keys`, async () => {
    const expected = [
      {
        id: 1,
        type: category,
        foo: '',
        bar: -1,
        baz: false,
      },
      { ...fakeData2, type: category },
    ];

    await updateOneProjection<TestEntity>(`${category}|1`, {
      foo: expected[0].foo,
      bar: expected[0].bar,
      baz: expected[0].baz,
      qux: undefined,
    });

    const results = await listProjection<TestEntity>(category, { orderBy: { id: 'ascending' } });
    expect(results.items).to.deep.eq(expected);
  });

  test(`escaping characters`, async () => {
    const expected = [
      {
        ...fakeData1,
        type: category,
        foo: `hello "you" with  'quotes' and \n \t \r`,
      },
      { ...fakeData2, type: category },
    ];

    await updateOneProjection<TestEntity>(`${category}|1`, { foo: expected[0].foo });

    const results = await listProjection<TestEntity>(category, { orderBy: { id: 'ascending' } });
    expect(results.items).to.deep.eq(expected);
  });
});
