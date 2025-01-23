'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierValue: referenceDossier,
    },
  });

  return {
    status: 'success',
    redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
  };
};

export const supprimerDossierDuRaccordementAction = formAction(action, schema);
