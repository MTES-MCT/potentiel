'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Puissance } from '@potentiel-domain/laureat';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Puissance.AnnulerChangementPuissanceUseCase>({
      type: 'Lauréat.Puissance.UseCase.AnnulerDemandeChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAnnulationValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'La demande de changement de puissance a bien été annulée',
      },
    };
  });
};

export const annulerChangementPuissanceAction = formAction(action, schema);
