import { z } from 'zod';

export const transformToOptionalEnumArray = <T extends z.ZodEnum<[string, ...string[]]>>(
  enumSchema: T,
) =>
  z.preprocess(
    (value) => (Array.isArray(value) ? value : value ? [value] : []),
    z.array(enumSchema).optional(),
  );
