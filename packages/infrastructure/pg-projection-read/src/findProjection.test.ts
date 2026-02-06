import { randomUUID } from 'node:crypto';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { should } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Entity } from '@potentiel-domain/entity';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { flatten } from '@potentiel-libraries/flat';

import { findProjection } from './findProjection.js';

should();

describe('findProjection', () => {
  let category1 = '';
  let category2 = '';
  let category3 = '';

  type FakeProjection1 = Entity<
    typeof category1,
    {
      data: {
        value: string;
        name: string;
      };
      moreData: string;
    }
  >;

  type FakeProjection2 = Entity<
    typeof category2,
    {
      moreData2: string;
    }
  >;
  type FakeProjection3 = Entity<
    typeof category3,
    {
      moreData3: string;
    }
  >;

  const fakeData1: Omit<FakeProjection1, 'type'> = {
    moreData: 'coucou',
    data: {
      value: 'value',
      name: 'name',
    },
  };

  const fakeData2: Omit<FakeProjection2, 'type'> = {
    moreData2: 'foo',
  };

  const fakeData3: Omit<FakeProjection3, 'type'> = {
    moreData3: 'bar',
  };

  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    category1 = `cat1-${randomUUID().slice(0, 8)}`;
    category2 = `cat2-${randomUUID().slice(0, 8)}`;
    category3 = `cat3-${randomUUID().slice(0, 8)}`;

    await executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category1}|${fakeData1.data.value}`,
      flatten(fakeData1),
    );
    await executeQuery(
      `insert
      into domain_views.projection
      values ($1, $2)`,
      `${category2}|${fakeData1.data.value}`,
      flatten(fakeData2),
    );
    await executeQuery(
      `insert
      into domain_views.projection
      values ($1, $2)`,
      `${category3}|${fakeData1.data.value}`,
      flatten(fakeData3),
    );
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category1}|%`);
  });

  it('should find a projection by its key', async () => {
    const id: `${string}|${string}` = `${category1}|${fakeData1.data.value}`;

    const actual = await findProjection<FakeProjection1>(id);

    const expected = {
      type: category1,
      ...fakeData1,
    };

    Option.isSome(actual).should.be.true;

    actual.should.deep.equal(expected);
  });

  it('should return none when the projection does not exist', async () => {
    const id: `${string}|${string}` = `${category1}|random`;

    const actual = await findProjection<FakeProjection1>(id);

    actual.should.equal(Option.none);
  });

  it('should return only selected fields when a select option is provided', async () => {
    const id: `${string}|${string}` = `${category1}|${fakeData1.data.value}`;

    const actual = await findProjection<FakeProjection1>(id, {
      select: ['data.name', 'data.value'],
    });

    const expected = {
      type: category1,
      data: fakeData1.data,
    };

    Option.isSome(actual).should.be.true;

    actual.should.deep.equal(expected);
  });

  it('should return the joined projection when a join option is provided', async () => {
    const id: `${string}|${string}` = `${category1}|${fakeData1.data.value}`;

    const actual = await findProjection<FakeProjection1, FakeProjection2>(id, {
      join: { on: 'data.value', entity: category2 },
    });

    const expected = {
      type: category1,
      [category2]: {
        moreData2: fakeData2.moreData2,
      },
      ...fakeData1,
    };

    Option.isSome(actual).should.be.true;

    actual.should.deep.equal(expected);
  });

  it('should return the joined projection when a multiple joins options are provided', async () => {
    const id: `${string}|${string}` = `${category1}|${fakeData1.data.value}`;

    const actual = await findProjection<FakeProjection1, [FakeProjection2, FakeProjection3]>(id, {
      join: [
        { on: 'data.value', entity: category2 },
        { on: 'data.value', entity: category3 },
      ],
    });

    const expected = {
      type: category1,
      [category2]: fakeData2,
      [category3]: fakeData3,
      ...fakeData1,
    };

    Option.isSome(actual).should.be.true;

    actual.should.deep.equal(expected);
  });
});
