import { should } from 'chai';

import { displayDate } from './displayDate';

const expected = '17/04/2023';

should();

describe('displayDate', () => {
  it('should format a valid date string', () => {
    const validDateString = '2023-04-17T12:00:00Z';

    const actual = displayDate(validDateString);

    actual.should.equal(expected);
  });

  it('should return the same formatted date if it is already in the correct format', () => {
    const actual = displayDate('17/04/2023');

    actual.should.equal(expected);
  });

  it('should throw an error for an invalid date string', () => {
    const invalidDateString = 'not a valid date';

    let error = new Error();

    try {
      displayDate(invalidDateString);
    } catch (e) {
      error = e as Error;
    }

    error.message.should.be.equal(`[displayDate] ${invalidDateString} is not a valid date string`);
  });

  it('should format a Date object', () => {
    const date = new Date(2023, 3, 17);

    const actual = displayDate(date);

    actual.should.equal(expected);
  });

  it('should format a number representing milliseconds since Unix epoch', () => {
    const dateInMilliseconds = 1681682400000;

    const actual = displayDate(dateInMilliseconds);

    actual.should.equal(expected);
  });
});
