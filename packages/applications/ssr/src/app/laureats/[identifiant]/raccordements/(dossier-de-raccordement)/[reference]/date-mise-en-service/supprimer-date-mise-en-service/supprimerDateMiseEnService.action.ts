'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
});

export type SupprimerDateMiseEnServiceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Raccordement.SupprimerDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.SupprimerDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue: referenceDossier,
        suppriméeLeValue: new Date().toISOString(),
        suppriméeParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
    };
  });

export const supprimerDateMiseEnServiceAction = formAction(action, schema);
