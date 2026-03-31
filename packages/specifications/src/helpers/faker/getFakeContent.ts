import { faker } from '@faker-js/faker';

import { convertStringToReadableStream } from '../convertStringToReadableStream.js';
import { PièceJustificative } from '../PièceJustificative.js';

import { getFakeFormat } from './getFakeFormat.js';

export const getFakeContent = (): ReadableStream => {
  return convertStringToReadableStream(faker.word.words());
};

export const getFakeDocument = (): PièceJustificative => {
  return {
    format: getFakeFormat(),
    content: faker.word.words(),
  };
};
