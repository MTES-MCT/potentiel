'use server';

import { Abandon } from '@potentiel-domain/laureat';
import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { FormAction, formAction, FormState } from '@/utils/formAction';

export type TransmettrePreuveRecandidatureState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  preuveRecandidature: zod.string(),
  identifiantUtilisateur: zod.string().email(),
  dateDesignation: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, preuveRecandidature, dateDesignation, identifiantUtilisateur },
) => {
  // TODO : Rendre cette vérification automatiquement lors de l'exécution
  //        d'un(e) query/usecase avec un identifiantProjet
  await mediator.send<VérifierAccèsProjetQuery>({
    type: 'VERIFIER_ACCES_PROJET_QUERY',
    data: {
      identifiantProjet,
      identifiantUtilisateur: identifiantUtilisateur,
    },
  });

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      preuveRecandidatureValue: preuveRecandidature,
      dateNotificationValue: dateDesignation,
      identifiantUtilisateurValue: identifiantUtilisateur,
    },
  });

  return previousState;
};

export const transmettrePreuveRecandidatureAction = formAction(action, schema);
