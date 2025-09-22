'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  keepOrUpdateManyDocuments,
  keepOrUpdateSingleDocument,
} from '@/utils/zod/document/keepOrUpdateDocument';

const commonSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(Lauréat.ReprésentantLégal.TypeReprésentantLégal.types),
  nomRepresentantLegal: zod.string().min(1),
  dateDemande: zod.string().min(1),
});

const schema = zod.discriminatedUnion('typeSociete', [
  zod.object({
    ...commonSchema.shape,
    typeSociete: zod.literal('constituée', {
      error: 'Le type de société est invalide',
    }),
    piecesJustificatives: keepOrUpdateSingleDocument({
      acceptedFileTypes: ['application/pdf'],
      applyWatermark: true,
    }),
  }),
  zod.object({
    ...commonSchema.shape,
    typeSociete: zod.enum(['en cours de constitution', 'non renseignée']),
    piecesJustificatives: keepOrUpdateManyDocuments({
      acceptedFileTypes: ['application/pdf'],
      applyWatermark: true,
    }),
  }),
]);

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
    await mediator.send<Lauréat.ReprésentantLégal.CorrigerChangementReprésentantLégalUseCase>({
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
        url: Routes.ReprésentantLégal.changement.détails(identifiantProjet, dateDemande),
        message: 'La demande de changement de représentant légal a bien été corrigée',
      },
    };
  });

export const corrigerChangementReprésentantLégalAction = formAction(action, schema);
