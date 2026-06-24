import z from 'zod';

import { FiltersSearchParams } from '@/utils/searchParams';

export const parseToArray = (value: unknown) =>
  Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(FiltersSearchParams.separator)
      : value
        ? [value]
        : [];

export const optionalStringArray = z.preprocess(parseToArray, z.array(z.string()).optional());
