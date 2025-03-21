'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { keepOrUpdateManyDocuments } from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateDemande: zod.string().min(1),
  typeRepresentantLegal: zod.enum(ReprésentantLégal.TypeReprésentantLégal.types, {
    invalid_type_error: 'Le type de réprésentant légal est invalide',
    required_error: 'Champ obligatoire',
  }),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
  piecesJustificatives: keepOrUpdateManyDocuments({
    acceptedFileTypes: ['application/pdf'],
    applyWatermark: true,
  }),
});

export type CorrigerChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    typeRepresentantLegal,
    nomRepresentantLegal,
    piecesJustificatives,
    dateDemande,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<ReprésentantLégal.CorrigerChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        typeReprésentantLégalValue: typeRepresentantLegal,
        nomReprésentantLégalValue: nomRepresentantLegal,
        pièceJustificativeValue: piecesJustificatives,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: dateDemande,
        dateCorrectionValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.ReprésentantLégal.changement.détail(identifiantProjet, dateDemande),
        message: 'La demande de changement de représentant légal a bien été corrigée',
      },
    };
  });

export const corrigerChangementReprésentantLégalAction = formAction(action, schema);
