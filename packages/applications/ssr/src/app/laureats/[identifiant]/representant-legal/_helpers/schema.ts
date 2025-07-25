import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';

import { manyDocuments } from '@/utils/zod/document/manyDocuments';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const commonSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(Lauréat.ReprésentantLégal.TypeReprésentantLégal.types, {
    invalid_type_error: 'Le type de réprésentant légal est invalide',
    required_error: 'Champ obligatoire',
  }),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export const demanderOuEnregistrerChangementSchema = zod.discriminatedUnion('typeSociete', [
  zod.object({
    ...commonSchema.shape,
    typeSociete: zod.literal('constituée', {
      invalid_type_error: 'Le type de société légal est invalide',
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
