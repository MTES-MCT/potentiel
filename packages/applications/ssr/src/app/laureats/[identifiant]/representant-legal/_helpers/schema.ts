import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';

import { manyDocuments } from '@/utils/zod/document/manyDocuments';

export const demanderOuEnregistrerChangementSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(Lauréat.ReprésentantLégal.TypeReprésentantLégal.types, {
    error: 'Le type de personne pour le représentant légal est obligatoire',
  }),
  nomRepresentantLegal: zod.string().min(1),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
    applyWatermark: true,
  }),
});

export type DemanderOuEnregistrerChangementReprésentantLégalFormKeys = keyof zod.infer<
  typeof demanderOuEnregistrerChangementSchema
>;
