import { describe, it } from 'node:test';

import { expect } from 'chai';

import { formatDateForEmail } from './formatDateForEmail';

describe('formatDateForEmail', () => {
  it('should return an empty string if the date is undefined', () => {
    const result = formatDateForEmail(undefined);
    expect(result).to.equal('');
  });

  it('should return the date in right format for a valid date object', () => {
    const date = new Date('2024-07-22T14:48:00.000Z');
    const result = formatDateForEmail(date);
    expect(result).to.equal('22/07/2024');
  });
});
