'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  preuveRecandidature: zod.string().min(1),
  dateDemande: zod.string().min(1),
});

export type TransmettrePreuveRecandidatureFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, preuveRecandidature, dateDemande },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        preuveRecandidatureValue: preuveRecandidature,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateTransmissionPreuveRecandidatureValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Abandon.détail(identifiantProjet, dateDemande) },
    };
  });

export const transmettrePreuveRecandidatureAction = formAction(action, schema);
