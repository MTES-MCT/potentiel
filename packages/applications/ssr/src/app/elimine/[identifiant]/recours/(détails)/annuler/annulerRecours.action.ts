'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Éliminé } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Éliminé.Recours.RecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.AnnulerRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAnnulationValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Projet.details(identifiantProjet) },
    };
  });
};

export const annulerRecoursAction = formAction(action, schema);
