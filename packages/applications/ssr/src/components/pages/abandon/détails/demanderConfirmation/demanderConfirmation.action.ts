'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Abandon } from '@potentiel-domain/laureat';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

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
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Abandon.AbandonUseCase>({
      type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
        réponseSignéeValue: {
          content: reponseSignee.stream(),
          format: reponseSignee.type,
        },
      },
    });

    return {
      status: 'success',
    };
  });
};

export const demanderConfirmationAbandonAction = formAction(action, schema);
