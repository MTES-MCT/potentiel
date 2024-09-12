'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Recours } from '@potentiel-domain/elimine';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type DemanderRecoursState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  raison: zod.string().min(1),
  pieceJustificative: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, pieceJustificative, raison },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Recours.RecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.DemanderRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
        raisonValue: raison,
        pièceJustificativeValue: {
          content: pieceJustificative.stream(),
          format: pieceJustificative.type,
        },
      },
    });

    return {
      status: 'success',
    };
  });
};

export const demanderRecoursAction = formAction(action, schema);
