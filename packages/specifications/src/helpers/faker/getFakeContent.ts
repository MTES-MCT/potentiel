import { faker } from '@faker-js/faker';
import mimeTypes from 'mime-types';

import { PièceJustificative } from '../PièceJustificative.js';

export const getFakeDocument = (contentType?: string): PièceJustificative => {
  return {
    format: contentType ?? getFakeFormat(),
    content: faker.word.words(),
  };
};

const getFakeFormat = (): string => {
  const value = mimeTypes.contentType(faker.system.fileExt());

  if (!value) {
    return getFakeFormat();
  }

  return value;
};
