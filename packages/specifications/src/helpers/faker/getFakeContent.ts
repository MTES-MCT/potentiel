import { faker } from '@faker-js/faker';
import { contentType } from 'mime-types';

import { PièceJustificative } from '../PièceJustificative.js';

export const getFakeDocument = (): PièceJustificative => {
  return {
    format: getFakeFormat(),
    content: faker.word.words(),
  };
};

const getFakeFormat = (): string => {
  const value = contentType(faker.system.fileExt());

  if (!value) {
    return getFakeFormat();
  }

  return value;
};
