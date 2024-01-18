'use server';

import { Abandon } from '@potentiel-domain/laureat';
import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string(),
  identifiantUtilisateur: zod.string().email(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, identifiantUtilisateur },
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
    type: 'CONFIRMER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: identifiantUtilisateur,
      dateConfirmationValue: new Date().toISOString(),
    },
  });

  return previousState;
};

export const confirmerAbandonAction = formAction(action, schema);
