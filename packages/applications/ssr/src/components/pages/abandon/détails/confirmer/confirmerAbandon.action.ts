'use server';

import { Abandon } from '@potentiel-domain/laureat';
import { mediator } from 'mediateur';
import * as zod from 'zod';

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
      type: 'CONFIRMER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateConfirmationValue: new Date().toISOString(),
      },
    });

    return previousState;
  });
};

export const confirmerAbandonAction = formAction(action, schema);
