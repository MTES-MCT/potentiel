'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(ReprésentantLégal.TypeReprésentantLégal.types, {
    invalid_type_error: 'Le type de réprésentant légal est invalide',
    required_error: 'Champ obligatoire',
  }),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
    applyWatermark: true,
  }),
});

export type DemanderChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nomRepresentantLegal, typeRepresentantLegal, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: nomRepresentantLegal,
        typeReprésentantLégalValue: typeRepresentantLegal,
        pièceJustificativeValue: piecesJustificatives,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
      },
    });
    return {
      status: 'success',
      redirection: {
        url: Routes.ReprésentantLégal.changement.détail(identifiantProjet),
        message: 'La demande de changement de représentant légal a bien été transmise',
      },
    };
  });

export const demanderChangementReprésentantLégalAction = formAction(action, schema);
