'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  documentSelectionSchema,
  keepOrUpdateManyDocuments,
} from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(Lauréat.ReprésentantLégal.TypeReprésentantLégal.types, {
    error: 'Ce type de représentant légal est invalide',
  }),
  nomRepresentantLegal: zod.string().min(1),
  dateDemande: zod.string().min(1),
  piecesJustificativesDocumentSelection: documentSelectionSchema,
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
    piecesJustificativesDocumentSelection,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ReprésentantLégal.CorrigerChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        typeReprésentantLégalValue: typeRepresentantLegal,
        nomReprésentantLégalValue: nomRepresentantLegal,
        pièceJustificativeValue:
          piecesJustificativesDocumentSelection === 'keep_existing_document'
            ? undefined
            : piecesJustificatives,
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
