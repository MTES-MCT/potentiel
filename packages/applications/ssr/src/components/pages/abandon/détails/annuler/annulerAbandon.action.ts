'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Abandon } from '@potentiel-domain/laureat';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Abandon.AbandonUseCase>({
      type: 'ANNULER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAnnulationValue: new Date().toISOString(),
      },
    });

    return previousState;
  });
};

export const annulerAbandonAction = formAction(action, schema);
