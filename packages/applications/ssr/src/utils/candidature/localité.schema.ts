import { z } from 'zod';

import {
  adresse1Schema,
  adresse2Schema,
  codePostalSchema,
  communeSchema,
  départementSchema,
  régionSchema,
} from './candidatureFields.schema';

export const localitéSchema = z.object({
  adresse1: adresse1Schema,
  adresse2: adresse2Schema,
  codePostal: codePostalSchema,
  commune: communeSchema,
  département: départementSchema,
  région: régionSchema,
});
