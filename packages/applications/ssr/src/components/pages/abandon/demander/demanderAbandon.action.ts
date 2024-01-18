'use server';

import { Abandon } from '@potentiel-domain/laureat';
import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { FormAction, formAction, FormState } from '@/utils/formAction';

export type DemanderAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  identifiantUtilisateur: zod.string().email(),
  recandidature: zod.string().optional(),
  raison: zod.string().min(1),
  pieceJustificative: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, pieceJustificative, identifiantUtilisateur, recandidature, raison },
) => {
  // TODO : Rendre cette vérification automatiquement lors de l'exécution
  //        d'un(e) query/usecase avec un identifiantProjet
  await mediator.send<VérifierAccèsProjetQuery>({
    type: 'VERIFIER_ACCES_PROJET_QUERY',
    data: {
      identifiantProjet,
      identifiantUtilisateur,
    },
  });

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'DEMANDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: identifiantUtilisateur,
      dateDemandeValue: new Date().toISOString(),
      raisonValue: raison,
      recandidatureValue: recandidature === 'true' ? true : false,
      ...(pieceJustificative.size > 0 && {
        pièceJustificativeValue: {
          content: pieceJustificative.stream(),
          format: pieceJustificative.type,
        },
      }),
    },
  });

  return previousState;
};

export const demanderAbandonAction = formAction(action, schema);
