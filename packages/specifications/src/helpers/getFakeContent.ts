import { faker } from '@faker-js/faker';

import { convertStringToReadableStream } from './convertStringToReadable';

export const getFakeContent = (): ReadableStream => {
  return convertStringToReadableStream(faker.word.words());
};
