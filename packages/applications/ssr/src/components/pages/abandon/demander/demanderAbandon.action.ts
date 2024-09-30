'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

export type DemanderAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  recandidature: zod.string().optional(),
  raison: zod.string().min(1, { message: 'Raison à préciser' }),
  pieceJustificative: document,
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, pieceJustificative, recandidature, raison },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
        raisonValue: raison,
        recandidatureValue: recandidature === 'true',
        ...(pieceJustificative.size > 0 && {
          pièceJustificativeValue: {
            content: pieceJustificative.stream(),
            format: pieceJustificative.type,
          },
        }),
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Abandon.détail(identifiantProjet),
    };
  });
};

export const demanderAbandonAction = formAction(action, schema);
