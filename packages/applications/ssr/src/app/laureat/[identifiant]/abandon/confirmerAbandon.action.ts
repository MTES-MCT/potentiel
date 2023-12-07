'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { getAccessToken } from '@/utils/getAccessToken';

export type ConfirmerAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet },
) => {
  await mediator.send<Abandon.AbandonUseCase>({
    type: 'CONFIRMER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      utilisateurValue: await getAccessToken(),
      dateConfirmationValue: new Date().toISOString(),
    },
  });

  return previousState;
};

export const confirmerAbandonAction = formAction(action, schema);
