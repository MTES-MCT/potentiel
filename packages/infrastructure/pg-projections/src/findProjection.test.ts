import { randomUUID } from 'node:crypto';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { should } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Entity } from '@potentiel-domain/entity';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { flatten, unflatten } from '@potentiel-libraries/flat';

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

  let fakeData: Omit<FakeProjection, 'type'>;

  before(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    category = randomUUID();

    fakeData = {
      data: {
        value: 'value',
        name: 'name',
      },
      moreData: 'coucou',
    };

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
      ...(unflatten<Omit<FakeProjection, 'type'>, Omit<FakeProjection, 'type'>>(fakeData) as Omit<
        FakeProjection,
        'type'
      >),
    };

    console.log(actual);
    console.log(expected);

    actual.should.equal(Option.isSome(expected));
  });

  it('should return none when the projection does not exist', async () => {
    const id: `${string}|${string}` = `${category}|nonexistent`;

    const actual = await findProjection<FakeProjection>(id);

    actual.should.equal(Option.none);
  });

  it('should return only selected fields when a select option is provided', async () => {
    const id: `${string}|${string}` = `${category}|${fakeData.data.value}`;

    const actual = await findProjection<FakeProjection>(id, { select: ['moreData'] });

    const expected = {
      type: category,
      moreData: fakeData.moreData,
    };

    console.log('key selected', actual);
    console.log(expected);

    console.log(actual);
    console.log(expected);

    actual.should.deep.equal(Option.isSome(expected));
  });
});
