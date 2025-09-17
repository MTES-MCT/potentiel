import { after, before, beforeEach, afterEach, describe, it } from 'node:test';
import { randomUUID } from 'node:crypto';

import { expect, should } from 'chai';

import { Entity, Where } from '@potentiel-domain/entity';
import { flatten } from '@potentiel-libraries/flat';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import { countProjection } from './countProjection';

should();

describe('countProjection', () => {
  let category = '';
  type FakeProjection = Entity<
    typeof category,
    {
      data: {
        value: string;
        name: string;
      };
    }
  >;

  let fakeData: Array<Omit<FakeProjection, 'type'>> = [];

  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    category = randomUUID();
    fakeData = [];

    for (let time = 0; time <= Math.random() * 100 + 10; time++) {
      fakeData.push({
        data: {
          value: `a random value ${time}`,
          name: `${time}`,
        },
      });
    }

    for (const fake of fakeData) {
      await executeQuery(
        `insert
        into domain_views.projection
        values ($1, $2)`,
        `${category}|${fake.data.value}`,
        flatten(fake),
      );
    }
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
  });

  it('should count projections by their key', async () => {
    const actual = await countProjection<FakeProjection>(category);

    const expected = fakeData.length;

    actual.should.be.deep.equal(expected);
  });

  it('should count projections by their key and filter them according to an equal condition option', async () => {
    const actual = await countProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.equal('1'),
        },
      },
    });

    const expected = 1;

    actual.should.be.deep.equal(expected);
  });

  it('should count projections by their key and filter them according to an not equal condition option', async () => {
    const actual = await countProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.notEqual('1'),
        },
      },
    });

    const expected = fakeData.filter((g) => g.data.name !== '1').length;

    actual.should.be.deep.equal(expected);
  });

  it('should count projections by their key and filter them according to a like condition option', async () => {
    const insensitiveCaseFakeData = {
      data: {
        value: 'a random value',
        name: 'A RANDOM NAME',
      },
    };

    fakeData.push(insensitiveCaseFakeData);

    await executeQuery(
      `insert
        into domain_views.projection
        values ($1, $2)`,
      `${category}|${insensitiveCaseFakeData.data.value}`,
      flatten(insensitiveCaseFakeData),
    );

    const actual = await countProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.startWith('a'),
        },
      },
    });

    const expected = fakeData.filter((g) => g.data.name.toLowerCase().startsWith('a')).length;

    actual.should.be.deep.equal(expected);
  });

  it('should count projections by their key and filter them according to a not like condition option', async () => {
    const insensitiveCaseFakeData = {
      data: {
        value: 'a random value',
        name: 'A RANDOM NAME',
      },
    };

    fakeData.push(insensitiveCaseFakeData);

    await executeQuery(
      `insert
        into domain_views.projection
        values ($1, $2)`,
      `${category}|${insensitiveCaseFakeData.data.value}`,
      flatten(insensitiveCaseFakeData),
    );

    const actual = await countProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.notStartWith('a'),
        },
      },
    });

    const expected = fakeData.filter((g) => !g.data.name.toLowerCase().startsWith('a')).length;

    actual.should.be.deep.equal(expected);
  });

  it('should count projections by their key and filter them according to a include condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await countProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.matchAny(valuesArray),
        },
      },
    });

    const expected = fakeData.filter(({ data }) => valuesArray.includes(data.name)).length;

    actual.should.be.deep.equal(expected);
  });

  it('should count projections by their key and filter them according to a not include condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await countProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.notMatchAny(valuesArray),
        },
      },
    });

    const expected = fakeData.filter(({ data }) => !valuesArray.includes(data.name)).length;

    actual.should.be.deep.equal(expected);
  });

  it('should count projections based on joined value', async () => {
    const actual = await countProjection<FakeProjection, FakeProjection>(category, {
      join: {
        entity: category,
        on: 'data.name', // wrong join on purpose so it returns no result
      },
    });

    expect(actual).to.eq(0);
  });
});
