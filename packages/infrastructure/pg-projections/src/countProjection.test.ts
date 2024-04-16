import { should } from 'chai';
import { after, before, beforeEach, afterEach, describe, it } from 'node:test';
import { randomUUID } from 'node:crypto';

import { Entity } from '@potentiel-domain/core';
import { flatten } from '../../../libraries/flat/dist';
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
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
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
          name: {
            operator: 'equal',
            value: '1',
          },
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
          name: {
            operator: 'notEqual',
            value: '1',
          },
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
          name: {
            operator: 'like',
            value: 'a%',
          },
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
          name: {
            operator: 'notLike',
            value: 'a%',
          },
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
          name: {
            operator: 'include',
            value: valuesArray,
          },
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
          name: {
            operator: 'notInclude',
            value: valuesArray,
          },
        },
      },
    });

    const expected = fakeData.filter(({ data }) => !valuesArray.includes(data.name)).length;

    actual.should.be.deep.equal(expected);
  });
});
