'use server';

import { Abandon } from '@potentiel-domain/laureat';
import { mediator } from 'mediateur';
import * as zod from 'zod';

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
      type: 'REJETER_ABANDON_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateRejetValue: new Date().toISOString(),
        réponseSignéeValue: {
          content: reponseSignee.stream(),
          format: reponseSignee.type,
        },
      },
    });

    return previousState;
  });
};

export const rejeterAbandonAction = formAction(action, schema);
