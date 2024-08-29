import { faker } from '@faker-js/faker';
import { contentType } from 'mime-types';

export const getFakeFormat = (): string => {
  const value = contentType(faker.system.fileExt());

  if (!value) {
    return getFakeFormat();
  }

  return value;
};
