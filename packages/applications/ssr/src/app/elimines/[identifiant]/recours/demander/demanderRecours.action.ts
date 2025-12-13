'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  raison: zod.string().min(1),
  pieceJustificative: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type DemanderRecoursFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, pieceJustificative, raison },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Éliminé.Recours.RecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.DemanderRecours',
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
      redirection: { url: Routes.Recours.détailPourRedirection(identifiantProjet) },
    };
  });
};

export const demanderRecoursAction = formAction(action, schema);
