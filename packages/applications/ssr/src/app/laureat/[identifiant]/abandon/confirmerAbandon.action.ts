'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ConfirmerAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  utilisateur: zod.string().email(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, utilisateur },
) => {
  await mediator.send<Abandon.AbandonUseCase>({
    type: 'CONFIRMER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: utilisateur,
      dateConfirmationValue: new Date().toISOString(),
    },
  });

  return previousState;
};

export const confirmerAbandonAction = formAction(action, schema);
