import { describe, it } from 'node:test';

import { expect } from 'chai';

import { FormattedForPageDate, displayDate } from './displayDate';

const expected = '17/04/2023';

describe('displayDate', () => {
  it('should format a valid date string', () => {
    const validDateString = '2023-04-17T12:00:00Z';

    const formattedDate: FormattedForPageDate = displayDate(validDateString);

    expect(formattedDate).to.equal(expected);
  });

  it('should return the same formatted date if it is already in the correct format', () => {
    const formattedDate: FormattedForPageDate = displayDate('17/04/2023');

    expect(formattedDate).to.equal(expected);
  });

  it('should throw an error for an invalid date string', () => {
    const invalidDateString = 'not a valid date';

    expect(() => displayDate(invalidDateString)).to.throw();
  });

  it('should format a Date object', () => {
    const date = new Date(2023, 3, 17);

    const formattedDate: FormattedForPageDate = displayDate(date);

    expect(formattedDate).to.equal(expected);
  });

  it('should format a number representing milliseconds since Unix epoch', () => {
    const timestamp = 1678545600000;

    const formattedDate: FormattedForPageDate = displayDate(timestamp);

    expect(formattedDate).to.equal(expected);
  });
});
