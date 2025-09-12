import { z } from 'zod';

export const transformToOptionalStringArray = z.preprocess(
  (value) => (Array.isArray(value) ? value : value ? [value] : []),
  z.array(z.string()).optional(),
);
