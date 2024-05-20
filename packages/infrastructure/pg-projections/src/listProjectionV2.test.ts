import { should } from 'chai';
import { randomUUID } from 'node:crypto';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { Entity, ListResultV2, RangeOptions } from '@potentiel-domain/core';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { flatten, unflatten } from '@potentiel-libraries/flat';

import {
  NegativeEndPositionError,
  NegativeStartPositionError,
  StartPositionEqualToEndPositionError,
  StartPositionGreaterThanEndPositionError,
} from './getRangeClause';
import { listProjectionV2 } from './listProjectionV2';

should();

describe('listProjectionV2', () => {
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

    await Promise.all(
      fakeData.map((fake) =>
        executeQuery(
          `insert
        into domain_views.projection
        values ($1, $2)`,
          `${category}|${fake.data.value}`,
          flatten(fake),
        ),
      ),
    );
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key ilike $1`, `${category}|%`);
  });

  const mapToListResultItems = (
    expectedData: Array<Omit<FakeProjection, 'type'>>,
  ): ListResultV2<FakeProjection> => ({
    total: expectedData.length,
    items: expectedData.map((g) => ({
      ...unflatten(g),
      type: category,
    })),
    range: {
      endPosition: expectedData.length,
      startPosition: 0,
    },
  });

  it('should find projections by their key', async () => {
    const actual = await listProjectionV2<FakeProjection>(category);

    const expected = mapToListResultItems(fakeData);

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and sort them according to an order option', async () => {
    const actual = await listProjectionV2<FakeProjection>(category, {
      orderBy: {
        data: {
          name: 'descending',
          value: 'descending',
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.sort(({ data: { value: a } }, { data: { value: b } }) => b.localeCompare(a)),
    );

    actual.should.deep.equal(expected);
  });

  it('should find projections by their key and limiting them according to a range option', async () => {
    const range: RangeOptions = {
      startPosition: 5,
      endPosition: 9,
    };

    const actual = await listProjectionV2<FakeProjection>(category, {
      range: range,
    });

    // as insertion order is not guaranteed, we need to use an (already tested) query here
    const allExpectedItems = await listProjectionV2<FakeProjection>(category);

    const expected = {
      ...mapToListResultItems(allExpectedItems.items.slice(5, 10)),
      total: fakeData.length,
      range,
    };

    actual.should.deep.equal(expected);
  });

  it('should throw when range start position is negative', async () => {
    const range: RangeOptions = {
      startPosition: -1,
      endPosition: 1,
    };

    let error = new Error();

    try {
      await listProjectionV2<FakeProjection>(category, {
        range: range,
      });
    } catch (e) {
      error = e as Error;
    }

    error.should.be.instanceOf(NegativeStartPositionError);
    error.message.should.be.equal('Start position must be a positive value');
  });

  it('should throw when range end position is negative', async () => {
    const range: RangeOptions = {
      startPosition: 1,
      endPosition: -1,
    };

    let error = new Error();

    try {
      await listProjectionV2<FakeProjection>(category, {
        range: range,
      });
    } catch (e) {
      error = e as Error;
    }

    error.should.be.instanceOf(NegativeEndPositionError);
    error.message.should.be.equal('End position must be a positive value');
  });

  it('should throw when range start position is greater than end position', async () => {
    const range: RangeOptions = {
      startPosition: 2,
      endPosition: 1,
    };

    let error = new Error();

    try {
      await listProjectionV2<FakeProjection>(category, {
        range: range,
      });
    } catch (e) {
      error = e as Error;
    }

    error.should.be.instanceOf(StartPositionGreaterThanEndPositionError);
    error.message.should.be.equal('Start position must be greater than end position value');
  });

  it('should throw when range start position is equal to end position', async () => {
    const range: RangeOptions = {
      startPosition: 1,
      endPosition: 1,
    };

    let error = new Error();

    try {
      await listProjectionV2<FakeProjection>(category, {
        range: range,
      });
    } catch (e) {
      error = e as Error;
    }

    error.should.be.instanceOf(StartPositionEqualToEndPositionError);
    error.message.should.be.equal('Start and end position values can not be the same');
  });

  it('should find projections by their key and filter them according to an equal condition option', async () => {
    const actual = await listProjectionV2<FakeProjection>(category, {
      where: {
        data: {
          name: {
            operator: 'equal',
            value: '1',
          },
        },
      },
    });

    const expected = mapToListResultItems(fakeData.filter((item) => item.data.name === '1'));

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to an not equal condition option', async () => {
    const actual = await listProjectionV2<FakeProjection>(category, {
      where: {
        data: {
          name: {
            operator: 'notEqual',
            value: '1',
          },
        },
      },
    });

    const expected = mapToListResultItems(fakeData.filter((g) => g.data.name !== '1'));

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a like condition option', async () => {
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

    const actual = await listProjectionV2<FakeProjection>(category, {
      where: {
        data: {
          name: {
            operator: 'like',
            value: 'a%',
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter((g) => g.data.name.toLowerCase().startsWith('a')),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a not like condition option', async () => {
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

    const actual = await listProjectionV2<FakeProjection>(category, {
      where: {
        data: {
          name: {
            operator: 'notLike',
            value: 'a%',
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter((g) => !g.data.name.toLowerCase().startsWith('a')),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a include condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjectionV2<FakeProjection>(category, {
      where: {
        data: {
          name: {
            operator: 'include',
            value: valuesArray,
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter(({ data }) => valuesArray.includes(data.name)),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a not include condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjectionV2<FakeProjection>(category, {
      where: {
        data: {
          name: {
            operator: 'notInclude',
            value: valuesArray,
          },
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter(({ data }) => !valuesArray.includes(data.name)),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });
});
