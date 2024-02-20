'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Abandon } from '@potentiel-domain/laureat';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type TransmettrePreuveRecandidatureState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  preuveRecandidature: zod.string().min(1),
  dateDesignation: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
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
        dateTransmissionPreuveRecandidatureValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
    };
  });
};

export const transmettrePreuveRecandidatureAction = formAction(action, schema);
