import { z } from 'zod';

import { motifEliminationSchema, noteTotaleSchema, statutSchema } from './candidatureFields.schema';

export const instructionSchema = z.object({
  statut: statutSchema,
  motifÉlimination: motifEliminationSchema,
  noteTotale: noteTotaleSchema,
});
