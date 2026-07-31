import z from 'zod';

import { FiltersSearchParams } from '@potentiel-applications/routes';

export const parseToArray = (value: string | string[] | undefined): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value.split(FiltersSearchParams.separator);
};

export const optionalStringArray = z.preprocess(parseToArray, z.array(z.string()).optional());
