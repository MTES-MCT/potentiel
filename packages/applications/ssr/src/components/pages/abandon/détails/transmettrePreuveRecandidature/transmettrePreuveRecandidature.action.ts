'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  preuveRecandidature: zod.string().min(1),
  dateDesignation: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type TransmettrePreuveRecandidatureFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, preuveRecandidature, dateDesignation },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
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
      redirection: { url: Routes.Abandon.détail(identifiantProjet) },
    };
  });

export const transmettrePreuveRecandidatureAction = formAction(action, schema);
