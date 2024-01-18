'use server';

import { Abandon } from '@potentiel-domain/laureat';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string(),
  identifiantUtilisateur: zod.string().email(),
  reponseSignee: zod
    .instanceof(Blob)
    .refine((data) => data.size > 0, { message: 'Vous devez joindre une réponse signée.' }),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee, identifiantUtilisateur },
) => {
  const réponseSignéeValue = {
    content: reponseSignee.stream(),
    format: reponseSignee.type,
  };

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'ACCORDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: identifiantUtilisateur,
      dateAccordValue: new Date().toISOString(),
      réponseSignéeValue,
    },
  });

  return previousState;
};

export const accorderAbandonSansRecandidatureAction = formAction(action, schema);
