'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier },
) => {
  const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  const estLeDernierDossier = Option.isSome(raccordement) && raccordement.dossiers.length === 1;

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
