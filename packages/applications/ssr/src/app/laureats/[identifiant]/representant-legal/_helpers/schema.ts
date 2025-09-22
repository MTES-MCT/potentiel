import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';

import { manyDocuments } from '@/utils/zod/document/manyDocuments';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const commonSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(Lauréat.ReprésentantLégal.TypeReprésentantLégal.types, {
    error: 'Le type de représentant légal est invalide',
  }),
  nomRepresentantLegal: zod.string().min(1),
});

export const demanderOuEnregistrerChangementSchema = zod.discriminatedUnion('typeSociete', [
  zod.object({
    ...commonSchema.shape,
    typeSociete: zod.literal('constituée', {
      error: 'Le type de société légal est invalide',
    }),
    piecesJustificatives: singleDocument({
      acceptedFileTypes: ['application/pdf'],
      applyWatermark: true,
    }),
  }),
  zod.object({
    ...commonSchema.shape,
    typeSociete: zod.enum(['en cours de constitution', 'non renseignée']),
    piecesJustificatives: manyDocuments({
      acceptedFileTypes: ['application/pdf'],
      applyWatermark: true,
    }),
  }),
]);

export type DemanderOuEnregistrerChangementReprésentantLégalFormKeys = keyof zod.infer<
  typeof demanderOuEnregistrerChangementSchema
>;
