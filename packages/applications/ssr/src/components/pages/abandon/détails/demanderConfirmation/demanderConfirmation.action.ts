'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string(),
  identifiantUtilisateur: zod.string().email(),
  reponseSignee: zod.instanceof(Blob).refine((data) => data.size > 0, {
    message: 'Vous devez joindre une réponse signée.',
  }),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee, identifiantUtilisateur },
) => {
  await mediator.send<Abandon.AbandonUseCase>({
    type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: identifiantUtilisateur,
      dateDemandeValue: new Date().toISOString(),
      réponseSignéeValue: {
        content: reponseSignee.stream(),
        format: reponseSignee.type,
      },
    },
  });

  return previousState;
};

export const demanderConfirmationAbandonAction = formAction(action, schema);
