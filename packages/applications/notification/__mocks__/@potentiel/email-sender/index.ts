import { jest } from '@jest/globals';

export const sendEmail = jest.fn((message: string) => {
  console.log(`Send email mocked !`);
});
