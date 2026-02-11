import { z } from 'zod';

import { conditionalRequiredError } from './schemaBase';
import { motifEliminationSchema, noteTotaleSchema, statutSchema } from './candidatureFields.schema';

export const instructionSchema = z
  .object({
    statut: statutSchema,
    motifÉlimination: motifEliminationSchema,
    noteTotale: noteTotaleSchema,
  })
  .superRefine((obj, ctx) => {
    const actualStatut = obj.statut;
    if (actualStatut === 'éliminé' && !obj.motifÉlimination) {
      ctx.addIssue(conditionalRequiredError('motifÉlimination', 'statut', actualStatut));
    }
    if (actualStatut === 'classé' && obj.motifÉlimination) {
      ctx.addIssue({
        code: 'custom',
        path: ['motifÉlimination'],
        message: "Un motif d'élimination ne devrait pas être renseigné pour un candidat classé",
      });
    }
  });

export type InstructionSchemaShape = z.infer<typeof instructionSchema>;
