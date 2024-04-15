import { should } from 'chai';
import { after, before, beforeEach, describe, it } from 'node:test';

import { Entity, RangeOptions, ListResultV2 } from '@potentiel-domain/core';
import { flatten, unflatten } from '../../../libraries/flat/dist';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import {
  NegativeEndPositionError,
  NegativeStartPositionError,
  StartPositionEqualToEndPositionError,
  StartPositionGreaterThanEndPositionError,
  listProjectionV2,
} from './listProjectionV2';

should();

describe('listProjectionV2', () => {
  type FakeProjection = Entity<
    'fake-projection',
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

  after(() => killPool());

  beforeEach(async () => {
    await executeQuery(`delete from domain_views.projection`);

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
        `fake-projection|${fake.data.value}`,
        flatten(fake),
      );
    }
  });

  const mapToListResultItems = (
    expectedData: Array<Omit<FakeProjection, 'type'>>,
  ): ListResultV2<FakeProjection> => ({
    total: expectedData.length,
    items: expectedData.map((g) => ({
      ...unflatten(g),
      type: 'fake-projection',
    })),
    range: {
      endPosition: expectedData.length,
      startPosition: 0,
    },
  });

  it('should find projections by their key', async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection');

    const expected = mapToListResultItems(fakeData);

    actual.should.be.deep.equal(expected);
  });

  it('should find projections by their key and sort them according to an order option', async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
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

    actual.should.be.deep.equal(expected);
  });

  it('should find projections by their key and limiting them according to a range option', async () => {
    const range: RangeOptions = {
      startPosition: 5,
      endPosition: 9,
    };

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      range: range,
    });

    const expected = {
      ...mapToListResultItems([fakeData[5], fakeData[6], fakeData[7], fakeData[8], fakeData[9]]),
      total: fakeData.length,
      range,
    };

    actual.should.be.deep.equal(expected);
  });

  it('should throw when range start position is negative', async () => {
    const range: RangeOptions = {
      startPosition: -1,
      endPosition: 1,
    };

    let error = new Error();

    try {
      await listProjectionV2<FakeProjection>('fake-projection', {
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
      await listProjectionV2<FakeProjection>('fake-projection', {
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
      await listProjectionV2<FakeProjection>('fake-projection', {
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
      await listProjectionV2<FakeProjection>('fake-projection', {
        range: range,
      });
    } catch (e) {
      error = e as Error;
    }

    error.should.be.instanceOf(StartPositionEqualToEndPositionError);
    error.message.should.be.equal('Start and end position values can not be the same');
  });

  it('should find projections by their key and filter them according to an equal condition option', async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
      where: {
        data: {
          name: {
            operator: 'equal',
            value: '1',
          },
        },
      },
    });

    const expected = mapToListResultItems([fakeData[1]]);

    actual.should.be.deep.equal(expected);
  });

  it('should find projections by their key and filter them according to an not equal condition option', async () => {
    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
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

    actual.should.be.deep.equal(expected);
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
      `fake-projection|${insensitiveCaseFakeData.data.value}`,
      flatten(insensitiveCaseFakeData),
    );

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
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

    actual.should.be.deep.equal(expected);
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
      `fake-projection|${insensitiveCaseFakeData.data.value}`,
      flatten(insensitiveCaseFakeData),
    );

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
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

    actual.should.be.deep.equal(expected);
  });

  it('should find projections by their key and filter them according to a include condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
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

    actual.should.be.deep.equal(expected);
  });

  it('should find projections by their key and filter them according to a not include condition option', async () => {
    const valuesArray = ['1', '2'];

    const actual = await listProjectionV2<FakeProjection>('fake-projection', {
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

    actual.should.be.deep.equal(expected);
  });
});
