import { randomUUID } from 'node:crypto';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { should } from 'chai';

import { Entity, ListResult, RangeOptions, Where } from '@potentiel-domain/entity';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { flatten, unflatten } from '@potentiel-libraries/flat';

import {
  NegativeEndPositionError,
  NegativeStartPositionError,
  StartPositionEqualToEndPositionError,
  StartPositionGreaterThanEndPositionError,
} from './getRangeClause';
import { listProjection } from './listProjection';

should();

describe('listProjection', () => {
  let category = '';
  let category2 = '';

  type FakeProjection = Entity<
    typeof category,
    {
      data: {
        value: string;
        name: string;
        testNull?: string;
        testArray?: string[];
      };
    }
  >;

  let fakeData: Array<Omit<FakeProjection, 'type'>> = [];

  const insertFakeData = (fake: Omit<FakeProjection, 'type'>) => {
    fakeData.push(fake);
    return executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category}|${fake.data.value}`,
      flatten(fake),
    );
  };

  type FakeProjection2 = Entity<
    typeof category2,
    {
      moreData2: string;
    }
  >;
  const joinProjectionFakeData: Omit<FakeProjection2, 'type'> = {
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
    fakeData = [];

    for (let time = 0; time <= Math.random() * 100 + 10; time++) {
      await insertFakeData({
        data: {
          value: `value${time}`,
          name: `name${time}`,
          testNull: `notNull${time}`,
        },
      });
    }

    await executeQuery(
      `insert
      into domain_views.projection
      values ($1, $2)`,
      `${category2}|${fakeData[0].data.value}`,
      flatten(joinProjectionFakeData),
    );
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category2}|%`);
  });

  const mapToListResultItems = (
    expectedData: Array<Omit<FakeProjection, 'type'>>,
  ): ListResult<FakeProjection> => ({
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
    const actual = await listProjection<FakeProjection>(category);

    const expected = mapToListResultItems(fakeData);

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and sort them according to an order option', async () => {
    const actual = await listProjection<FakeProjection>(category, {
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

    const actual = await listProjection<FakeProjection>(category, {
      range: range,
    });

    // as insertion order is not guaranteed, we need to use an (already tested) query here
    const allExpectedItems = await listProjection<FakeProjection>(category);

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
      await listProjection<FakeProjection>(category, {
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
      await listProjection<FakeProjection>(category, {
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
      await listProjection<FakeProjection>(category, {
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
      await listProjection<FakeProjection>(category, {
        range: range,
      });
    } catch (e) {
      error = e as Error;
    }

    error.should.be.instanceOf(StartPositionEqualToEndPositionError);
    error.message.should.be.equal('Start and end position values can not be the same');
  });

  it('should find projections by their key and filter them according to an equal condition option', async () => {
    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.equal('name1'),
        },
      },
    });

    const expected = mapToListResultItems(fakeData.filter((item) => item.data.name === 'name1'));

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to an not equal condition option', async () => {
    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.notEqual('name1'),
        },
      },
    });

    const expected = mapToListResultItems(fakeData.filter((g) => g.data.name !== 'name1'));

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

    await insertFakeData(insensitiveCaseFakeData);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.endWith('1'),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter((g) => g.data.name.toLowerCase().endsWith('1')),
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

    await insertFakeData(insensitiveCaseFakeData);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.notEndWith('1'),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter((g) => !g.data.name.toLowerCase().endsWith('1')),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a matchAny condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.matchAny(valuesArray),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter(({ data }) => valuesArray.includes(data.name)),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a not matchAny condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.notMatchAny(valuesArray),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter(({ data }) => !valuesArray.includes(data.name)),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a is null condition option', async () => {
    const nullCaseFakeData = {
      data: {
        value: 'null case',
        name: 'null case',
      },
    };

    await insertFakeData(nullCaseFakeData);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          testNull: Where.equalNull(),
        },
      },
    });

    const expected = mapToListResultItems(fakeData.filter(({ data }) => !data.testNull));

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a greaterThan condition option', async () => {
    const greaterThanCaseFakeData = {
      data: {
        value: '2023-11-30T00:00:00.000Z',
        name: 'greaterThanTest',
      },
    };

    const greaterThanCaseFakeDataExcluded = {
      data: {
        value: '2023-11-28T00:00:00.000Z',
        name: 'greaterThanTest',
      },
    };

    await insertFakeData(greaterThanCaseFakeData);
    await insertFakeData(greaterThanCaseFakeDataExcluded);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.equal(greaterThanCaseFakeData.data.name),
          value: Where.greaterOrEqual('2023-11-29T00:00:00.000Z'),
        },
      },
    });

    const expected = mapToListResultItems([greaterThanCaseFakeData]);

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a lessThan condition option', async () => {
    const lessThanCaseFakeDataExcluded = {
      data: {
        value: '2023-11-30T00:00:00.000Z',
        name: 'lessThanTest',
      },
    };

    const lessThanCaseFakeData = {
      data: {
        value: '2023-11-28T00:00:00.000Z',
        name: 'lessThanTest',
      },
    };

    await insertFakeData(lessThanCaseFakeData);
    await insertFakeData(lessThanCaseFakeDataExcluded);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.equal(lessThanCaseFakeData.data.name),
          value: Where.lessOrEqual('2023-11-29T00:00:00.000Z'),
        },
      },
    });

    const expected = mapToListResultItems([lessThanCaseFakeData]);

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a greaterThan condition, combined with is null', async () => {
    const greaterThanCaseFakeData = {
      data: {
        value: '2023-11-30T00:00:00.000Z',
        name: 'greaterThanTest',
      },
    };

    const greaterThanCaseFakeDataExcluded = {
      data: {
        value: '2023-11-28T00:00:00.000Z',
        name: 'greaterThanTest',
      },
    };

    await insertFakeData(greaterThanCaseFakeData);
    await insertFakeData(greaterThanCaseFakeDataExcluded);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.equal(greaterThanCaseFakeData.data.name),
          // important, the testNull check must not be last for this test to be valid
          testNull: Where.equalNull(),
          value: Where.greaterOrEqual('2023-11-29T00:00:00.000Z'),
        },
      },
    });

    const expected = mapToListResultItems([greaterThanCaseFakeData]);

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a is not null condition option', async () => {
    const nullCaseFakeData = {
      data: {
        value: 'null case',
        name: 'null case',
      },
    };

    await insertFakeData(nullCaseFakeData);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          testNull: Where.notEqualNull(),
        },
      },
    });

    const expected = mapToListResultItems(fakeData.filter(({ data }) => !!data.testNull));

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a include condition option', async () => {
    const arrayCaseFakeData1 = {
      data: {
        testArray: ['1', '2'],
        value: 'array case1',
        name: 'array case1',
      },
    };
    const arrayCaseFakeData2 = {
      data: {
        testArray: ['2', '3'],
        value: 'array case2',
        name: 'array case2',
      },
    };

    await insertFakeData(arrayCaseFakeData1);
    await insertFakeData(arrayCaseFakeData2);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          testArray: Where.include('1'),
        },
      },
    });

    const expected = mapToListResultItems([arrayCaseFakeData1]);

    actual.items.should.have.lengthOf(1);
    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a not include condition option', async () => {
    const arrayCaseFakeData1 = {
      data: {
        testArray: ['1', '2'],
        value: 'array case1',
        name: 'array case1',
      },
    };
    const arrayCaseFakeData2 = {
      data: {
        testArray: ['2', '3'],
        value: 'array case2',
        name: 'array case2',
      },
    };

    await insertFakeData(arrayCaseFakeData1);
    await insertFakeData(arrayCaseFakeData2);

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          testArray: Where.notInclude('3'),
        },
      },
    });

    const expected = mapToListResultItems([arrayCaseFakeData1]);

    actual.items.should.have.lengthOf(1);
    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a not matchAny condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjection<FakeProjection>(category, {
      where: {
        data: {
          name: Where.notMatchAny(valuesArray),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData.filter(({ data }) => !valuesArray.includes(data.name)),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections with joined projection', async () => {
    const expected = mapToListResultItems([fakeData[0]]);
    const expectedItems = expected.items.map((item) => ({
      ...item,
      [category2]: {
        moreData2: joinProjectionFakeData.moreData2,
      },
    }));

    const actual = await listProjection<FakeProjection, FakeProjection2>(category, {
      join: { on: 'data.value', entity: category2 },
    });

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expectedItems);
  });

  it('should find projections with joined projection and where clause matching results', async () => {
    const expected = mapToListResultItems([fakeData[0]]);
    const expectedItems = expected.items.map((item) => ({
      ...item,
      [category2]: {
        moreData2: joinProjectionFakeData.moreData2,
      },
    }));

    const actual = await listProjection<FakeProjection, FakeProjection2>(category, {
      join: { on: 'data.value', entity: category2, where: { moreData2: Where.equal('foo') } },
    });

    actual.items.length.should.eq(1);
    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expectedItems);
  });

  it('should find projections with joined projection and where clause matching no results', async () => {
    const actual = await listProjection<FakeProjection, FakeProjection2>(category, {
      join: { on: 'data.value', entity: category2, where: { moreData2: Where.equal('bar') } },
    });

    actual.items.length.should.eq(0);
  });
});
