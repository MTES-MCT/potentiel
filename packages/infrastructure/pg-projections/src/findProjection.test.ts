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

  const fakeData: Omit<FakeProjection, 'type'> = {
    moreData: 'coucou',
    data: {
      value: 'value',
      name: 'name',
    },
  };

  before(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    category = randomUUID();

    await executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category}|${fakeData.data.value}`,
      flatten(fakeData),
    );
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
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
});
