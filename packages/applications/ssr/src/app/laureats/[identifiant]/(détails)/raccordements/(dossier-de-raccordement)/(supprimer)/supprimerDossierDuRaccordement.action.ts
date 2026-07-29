'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue: referenceDossier,
        suppriméLeValue: new Date().toISOString(),
        suppriméParValue: utilisateur.identifiantUtilisateur.formatter(),
        rôleValue: utilisateur.rôle.nom,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Raccordement.détail(identifiantProjet),
      },
    };
  });

export const supprimerDossierDuRaccordementAction = formAction(action, schema);
