'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';

import { booleanSchema } from '../../../../../utils/candidature/schemaBase';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  estLeDernierDossier: booleanSchema,
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, estLeDernierDossier },
) => {
  await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierValue: referenceDossier,
    },
  });

  return {
    status: 'success',
    redirection: {
      url: estLeDernierDossier
        ? Routes.Projet.details(identifiantProjet)
        : Routes.Raccordement.détail(identifiantProjet),
    },
  };
};

export const supprimerDossierDuRaccordementAction = formAction(action, schema);
