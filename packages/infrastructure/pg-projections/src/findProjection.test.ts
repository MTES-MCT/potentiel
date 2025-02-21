import { randomUUID } from 'node:crypto';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { should } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Entity } from '@potentiel-domain/entity';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { flatten } from '@potentiel-libraries/flat';

import { findProjection } from './findProjection';

should();

describe('findProjection', () => {
  let category = '';
  let category2 = '';

  type FakeProjection = Entity<
    typeof category,
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

  const fakeData: Omit<FakeProjection, 'type'> = {
    moreData: 'coucou',
    data: {
      value: 'value',
      name: 'name',
    },
  };

  const fakeData2: Omit<FakeProjection2, 'type'> = {
    moreData2: 'foo',
  };

  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    category = randomUUID();
    category2 = randomUUID();

    await executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category}|${fakeData.data.value}`,
      flatten(fakeData),
    );
    await executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category2}|${fakeData.data.value}`,
      flatten(fakeData2),
    );
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category2}|%`);
  });

  it('should find a projection by its key', async () => {
    const id: `${string}|${string}` = `${category}|${fakeData.data.value}`;

    const actual = await findProjection<FakeProjection>(id);

    const expected = {
      type: category,
      ...fakeData,
    };

    Option.isSome(actual).should.be.true;

    actual.should.deep.equal(expected);
  });

  it('should return none when the projection does not exist', async () => {
    const id: `${string}|${string}` = `${category}|random`;

    const actual = await findProjection<FakeProjection>(id);

    actual.should.equal(Option.none);
  });

  it('should return only selected fields when a select option is provided', async () => {
    const id: `${string}|${string}` = `${category}|${fakeData.data.value}`;

    const actual = await findProjection<FakeProjection>(id, {
      select: ['data.name', 'data.value'],
    });

    const expected = {
      type: category,
      data: fakeData.data,
    };

    Option.isSome(actual).should.be.true;

    actual.should.deep.equal(expected);
  });

  it('should return joined projection when a join option is provided', async () => {
    const actual = await findProjection<FakeProjection, FakeProjection2>(
      `${category}|${fakeData.data.value}`,
      {
        join: { key: 'data.value', entityType: category2 },
      },
    );

    const expected = {
      type: category,
      ...fakeData,
      [category2]: {
        moreData2: 'foo',
      },
    };

    Option.isSome(actual).should.be.true;

    actual.should.deep.equal(expected);
  });
});
