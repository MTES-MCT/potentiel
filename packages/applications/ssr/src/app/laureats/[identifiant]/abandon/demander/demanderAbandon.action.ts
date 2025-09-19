'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  raison: zod.string().min(1),
  pieceJustificative: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type DemanderAbandonFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, raison, pieceJustificative },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
        raisonValue: raison,
        pièceJustificativeValue: pieceJustificative,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Abandon.détail(identifiantProjet) },
    };
  });
};

export const demanderAbandonAction = formAction(action, schema);
