import { faker } from '@faker-js/faker';

import { convertStringToReadableStream } from './convertStringToReadable.js';
import { getFakeFormat } from './getFakeFormat.js';

export const getFakeContent = (): ReadableStream => {
  return convertStringToReadableStream(faker.word.words());
};

export const getFakeDocument = (): { format: string; content: string } => {
  return {
    format: getFakeFormat(),
    content: faker.word.words(),
  };
};
