import { z } from 'zod';

import { parseToArray } from './optionalStringArray';

export const transformToEnumArray = <T extends z.ZodEnum>(enumSchema: T) =>
  z.preprocess(parseToArray, z.array(enumSchema));
