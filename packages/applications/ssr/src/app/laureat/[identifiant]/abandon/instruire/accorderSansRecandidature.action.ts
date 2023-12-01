'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';

export type AccorderAbandonSansRecandidatureState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  utilisateur: zod.string().email(),
  reponseSignee: zod
    .instanceof(Blob)
    .refine((data) => data.size > 0, { message: 'Vous devez joindre une réponse signée.' }),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee, utilisateur },
) => {
  const réponseSignéeValue = {
    content: reponseSignee.stream(),
    format: reponseSignee.type,
  };

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'ACCORDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      utilisateurValue: utilisateur,
      dateAccordValue: new Date().toISOString(),
      réponseSignéeValue,
    },
  });

  return previousState;
};

export const accorderAbandonSansRecandidatureAction = formAction(action, schema);
