'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';

export type AnnulerAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  utilisateur: zod.string().email(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, utilisateur },
) => {
  await mediator.send<Abandon.AbandonUseCase>({
    type: 'ANNULER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      utilisateurValue: utilisateur,
      dateAnnulationValue: new Date().toISOString(),
    },
  });

  return previousState;
};

export const annulerAbandonAction = formAction(action, schema);
