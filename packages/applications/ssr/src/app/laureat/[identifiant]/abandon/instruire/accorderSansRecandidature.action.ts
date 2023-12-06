'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { getAccessToken } from '@/utils/getAccessToken';

export type AccorderAbandonSansRecandidatureState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  reponseSignee: zod.instanceof(Blob).refine((data) => data.size > 0, {
    message: 'Vous devez joindre une réponse signée.',
  }),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee },
) => {
  const réponseSignéeValue = {
    content: reponseSignee.stream(),
    format: reponseSignee.type,
  };

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'ACCORDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      utilisateurValue: await getAccessToken(),
      dateAccordValue: new Date().toISOString(),
      réponseSignéeValue,
    },
  });

  return previousState;
};

export const accorderAbandonSansRecandidatureAction = formAction(action, schema);
