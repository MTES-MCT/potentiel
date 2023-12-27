'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type TransmettrePreuveRecandidatureState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  preuveRecandidature: zod.string(),
  dateDesignation: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, preuveRecandidature, dateDesignation },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Abandon.AbandonUseCase>({
      type: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        preuveRecandidatureValue: preuveRecandidature,
        dateNotificationValue: dateDesignation,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return previousState;
  });
};

export const transmettrePreuveRecandidatureAction = formAction(action, schema);
