import { randomUUID } from 'node:crypto';
import { after, afterEach, before, beforeEach, describe, it } from 'node:test';

import { should } from 'chai';

import { Entity, LeftJoin, ListResult, RangeOptions, Where } from '@potentiel-domain/entity';
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
  let category1 = '';
  let category2 = '';
  let category3 = '';

  type FakeProjection1 = Entity<
    typeof category1,
    {
      data: {
        value: string;
        name: string;
        testNull?: string;
        testArray?: string[];
      };
    }
  >;

  let fakeData1: Array<Omit<FakeProjection1, 'type'>> = [];

  const insertFakeData = (fake: Omit<FakeProjection1, 'type'>) => {
    fakeData1.push(fake);
    return executeQuery(
      `insert into domain_views.projection values ($1, $2)`,
      `${category1}|${fake.data.value}`,
      flatten(fake),
    );
  };

  type FakeProjection2 = Entity<
    typeof category2,
    {
      moreData2: string;
      foo?: number;
    }
  >;
  type FakeProjection3 = Entity<
    typeof category3,
    {
      moreData3: string;
    }
  >;
  const fakeData2: Omit<FakeProjection2, 'type'> = {
    moreData2: 'foo',
    foo: 1,
  };
  const fakeData3: Omit<FakeProjection3, 'type'> = {
    moreData3: 'foo',
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
    fakeData1 = [];

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
      `${category2}|${fakeData1[0].data.value}`,
      flatten(fakeData2),
    );

    await executeQuery(
      `insert
      into domain_views.projection
      values ($1, $2)`,
      `${category3}|${fakeData1[0].data.value}`,
      flatten(fakeData3),
    );
  });

  afterEach(async () => {
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category1}|%`);
    await executeQuery(`delete from domain_views.projection where key like $1`, `${category2}|%`);
  });

  const mapToListResultItems = (
    expectedData: Array<Omit<FakeProjection1, 'type'>>,
  ): ListResult<FakeProjection1> => ({
    total: expectedData.length,
    items: expectedData.map((g) => ({
      ...unflatten(g),
      type: category1,
    })),
    range: {
      endPosition: expectedData.length,
      startPosition: 0,
    },
  });

  it('should find projections by their key', async () => {
    const actual = await listProjection<FakeProjection1>(category1);

    const expected = mapToListResultItems(fakeData1);

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and sort them according to an order option', async () => {
    const actual = await listProjection<FakeProjection1>(category1, {
      orderBy: {
        data: {
          name: 'descending',
          value: 'descending',
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData1.sort(({ data: { value: a } }, { data: { value: b } }) => b.localeCompare(a)),
    );

    actual.should.deep.equal(expected);
  });

  it('should find projections by their key and limiting them according to a range option', async () => {
    const range: RangeOptions = {
      startPosition: 5,
      endPosition: 9,
    };

    const actual = await listProjection<FakeProjection1>(category1, {
      range: range,
    });

    // as insertion order is not guaranteed, we need to use an (already tested) query here
    const allExpectedItems = await listProjection<FakeProjection1>(category1);

    const expected = {
      ...mapToListResultItems(allExpectedItems.items.slice(5, 10)),
      total: fakeData1.length,
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
      await listProjection<FakeProjection1>(category1, {
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
      await listProjection<FakeProjection1>(category1, {
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
      await listProjection<FakeProjection1>(category1, {
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
      await listProjection<FakeProjection1>(category1, {
        range: range,
      });
    } catch (e) {
      error = e as Error;
    }

    error.should.be.instanceOf(StartPositionEqualToEndPositionError);
    error.message.should.be.equal('Start and end position values can not be the same');
  });

  it('should find projections by their key and filter them according to an equal condition option', async () => {
    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          name: Where.equal('name1'),
        },
      },
    });

    const expected = mapToListResultItems(fakeData1.filter((item) => item.data.name === 'name1'));

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to an not equal condition option', async () => {
    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          name: Where.notEqual('name1'),
        },
      },
    });

    const expected = mapToListResultItems(fakeData1.filter((g) => g.data.name !== 'name1'));

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

    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          name: Where.endWith('1'),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData1.filter((g) => g.data.name.toLowerCase().endsWith('1')),
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

    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          name: Where.notEndWith('1'),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData1.filter((g) => !g.data.name.toLowerCase().endsWith('1')),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a matchAny condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          name: Where.matchAny(valuesArray),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData1.filter(({ data }) => valuesArray.includes(data.name)),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  it('should find projections by their key and filter them according to a not matchAny condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          name: Where.notMatchAny(valuesArray),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData1.filter(({ data }) => !valuesArray.includes(data.name)),
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

    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          testNull: Where.equalNull(),
        },
      },
    });

    const expected = mapToListResultItems(fakeData1.filter(({ data }) => !data.testNull));

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

    const actual = await listProjection<FakeProjection1>(category1, {
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

    const actual = await listProjection<FakeProjection1>(category1, {
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

    const actual = await listProjection<FakeProjection1>(category1, {
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

    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          testNull: Where.notEqualNull(),
        },
      },
    });

    const expected = mapToListResultItems(fakeData1.filter(({ data }) => !!data.testNull));

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

    const actual = await listProjection<FakeProjection1>(category1, {
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

    const actual = await listProjection<FakeProjection1>(category1, {
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

    const actual = await listProjection<FakeProjection1>(category1, {
      where: {
        data: {
          name: Where.notMatchAny(valuesArray),
        },
      },
    });

    const expected = mapToListResultItems(
      fakeData1.filter(({ data }) => !valuesArray.includes(data.name)),
    );

    actual.should.have.all.keys(Object.keys(expected));

    actual.items.should.have.deep.members(expected.items);
  });

  describe('single join', () => {
    it('should find projections with joined projection', async () => {
      const expected = mapToListResultItems([fakeData1[0]]);
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: fakeData2,
      }));

      const actual = await listProjection<FakeProjection1, FakeProjection2>(category1, {
        join: { on: 'data.value', entity: category2 },
      });

      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });

    it('should find projections with joined projection and where clause matching results', async () => {
      const expected = mapToListResultItems([fakeData1[0]]);
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: fakeData2,
      }));

      const actual = await listProjection<FakeProjection1, FakeProjection2>(category1, {
        join: { on: 'data.value', entity: category2, where: { moreData2: Where.equal('foo') } },
      });

      actual.items.length.should.eq(1);
      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });

    it('should find projections with joined projection and where clause matching no results', async () => {
      const actual = await listProjection<FakeProjection1, FakeProjection2>(category1, {
        join: { on: 'data.value', entity: category2, where: { moreData2: Where.equal('bar') } },
      });

      actual.items.length.should.eq(0);
    });

    it("should find projections joined on a different key than the entity's key", async () => {
      const expectedItems = [
        {
          type: category2,
          ...fakeData2,
          [category3]: fakeData3,
        },
      ];

      const actual = await listProjection<FakeProjection2, FakeProjection3>(category2, {
        join: { on: 'moreData2', entity: category3, joinKey: 'moreData3' },
      });

      actual.items.should.have.deep.members(expectedItems);
    });
  });

  describe('multiple join', () => {
    it('should find projections with multiple joined projection', async () => {
      const expected = mapToListResultItems([fakeData1[0]]);
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: fakeData2,
        [category3]: fakeData3,
      }));

      const actual = await listProjection<FakeProjection1, [FakeProjection2, FakeProjection3]>(
        category1,
        {
          join: [
            { entity: category2, on: 'data.value' },
            { entity: category3, on: 'data.value' },
          ],
        },
      );

      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });

    it('should find projections with multiple joined projection where clause matching results', async () => {
      const expected = mapToListResultItems([fakeData1[0]]);
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: fakeData2,
        [category3]: fakeData3,
      }));
      const actual = await listProjection<FakeProjection1, [FakeProjection2, FakeProjection3]>(
        category1,
        {
          join: [
            { entity: category2, on: 'data.value' },
            { entity: category3, on: 'data.value', where: { moreData3: Where.equal('foo') } },
          ],
        },
      );

      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });

    it('should find projections with multiple joined projection where clause not matching results', async () => {
      const actual = await listProjection<FakeProjection1, [FakeProjection2, FakeProjection3]>(
        category1,
        {
          join: [
            { entity: category2, on: 'data.value' },
            { entity: category3, on: 'data.value', where: { moreData3: Where.equal('bar') } },
          ],
        },
      );

      actual.items.length.should.eq(0);
    });

    it('should find projections with multiple joined projection and multiple where clauses matching results', async () => {
      const expected = mapToListResultItems(fakeData1.slice(0, 1));
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: fakeData2,
        [category3]: fakeData3,
      }));

      const actual = await listProjection<
        FakeProjection1,
        [LeftJoin<FakeProjection2>, LeftJoin<FakeProjection3>]
      >(category1, {
        join: [
          {
            on: 'data.value',
            entity: category2,
            type: 'left',
            where: {
              moreData2: Where.notEqualNull(),
            },
          },
          {
            entity: category3,
            on: 'data.value',
            type: 'left',
            where: {
              moreData3: Where.notEqualNull(),
            },
          },
        ],
      });

      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });

    it('should find projections with multiple joined projection and multiple where clauses per join', async () => {
      const expected = mapToListResultItems(fakeData1.slice(0, 1));
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: fakeData2,
        [category3]: fakeData3,
      }));

      const actual = await listProjection<
        FakeProjection1,
        [LeftJoin<FakeProjection2>, LeftJoin<FakeProjection3>]
      >(category1, {
        join: [
          {
            on: 'data.value',
            entity: category2,
            type: 'left',
            where: {
              moreData2: Where.equal('foo'),
              foo: Where.equal(1),
            },
          },
          {
            entity: category3,
            on: 'data.value',
            type: 'left',
            where: {
              moreData3: Where.equal('foo'),
            },
          },
        ],
      });

      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });

    it('should find projections with multiple joined projection and undefined where clauses', async () => {
      const expected = mapToListResultItems(fakeData1.slice(0, 1));
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: fakeData2,
        [category3]: fakeData3,
      }));

      const actual = await listProjection<FakeProjection1, [FakeProjection2, FakeProjection3]>(
        category1,
        {
          join: [
            {
              on: 'data.value',
              entity: category2,
              where: {
                moreData2: undefined,
              },
            },
            {
              entity: category3,
              on: 'data.value',
              where: {
                moreData3: Where.like('foo'),
              },
            },
          ],
        },
      );

      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });
  });

  describe('left join', () => {
    it('should find projections with left joined projection', async () => {
      const expected = mapToListResultItems(fakeData1);
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: null,
      }));

      const actual = await listProjection<FakeProjection1, LeftJoin<FakeProjection2>>(category1, {
        join: {
          on: 'data.name', // wrong join on purpose so it returns no result
          entity: category2,
          type: 'left',
        },
      });

      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });

    it('should find projections with left joined projection and where clause', async () => {
      const expected = mapToListResultItems(fakeData1.slice(0, 1));
      const expectedItems = expected.items.map((item) => ({
        ...item,
        [category2]: fakeData2,
      }));

      const actual = await listProjection<FakeProjection1, LeftJoin<FakeProjection2>>(category1, {
        join: {
          on: 'data.value',
          entity: category2,
          type: 'left',
          where: {
            moreData2: Where.notEqualNull(),
          },
        },
      });

      actual.should.have.all.keys(Object.keys(expected));

      actual.items.should.have.deep.members(expectedItems);
    });
  });
});
