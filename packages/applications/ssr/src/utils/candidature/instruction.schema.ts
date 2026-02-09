import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';

import { conditionalRequiredError } from './schemaBase';
import { numberSchema, optionalStringSchema } from './schemaBase';

export type InstructionSchemaShape = z.infer<typeof instructionSchema>;

export const instructionSchema = z
  .object({
    statut: z.enum(Candidature.StatutCandidature.statuts),
    motifÉlimination: optionalStringSchema,
    noteTotale: numberSchema,
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
        message:
          '"motifÉlimination" ne devrait pas être renseigné lorsque "statut" a la valeur "classé"',
      });
    }
  });
