'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  documentSelectionSchema,
  keepOrUpdateSingleDocument,
} from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateDemande: zod.string().min(1),
  nombreDeMois: zod.coerce.number().min(1),
  raison: zod.string().min(1),
  pieceJustificative: keepOrUpdateSingleDocument({ acceptedFileTypes: ['application/pdf'] }),
  pieceJustificativeDocumentSelection: documentSelectionSchema,
});

export type CorrigerDemandeDélaiFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    dateDemande,
    pieceJustificative,
    pieceJustificativeDocumentSelection,
    nombreDeMois,
    raison,
  },
) => {
  return withUtilisateur(async (utilisateur) => {
    const dateCorrectionValue = DateTime.now().formatter();

    await mediator.send<Lauréat.Délai.CorrigerDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.CorrigerDemandeDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: dateDemande,
        dateCorrectionValue,
        pièceJustificativeValue:
          pieceJustificativeDocumentSelection === 'edit_document' ? pieceJustificative : undefined,
        raisonValue: raison,
        nombreDeMoisValue: nombreDeMois,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Délai.détail(
          identifiantProjet,
          DateTime.convertirEnValueType(dateDemande).formatter(),
        ),
      },
    };
  });
};

export const corrigerDemandeDélaiAction = formAction(action, schema);
