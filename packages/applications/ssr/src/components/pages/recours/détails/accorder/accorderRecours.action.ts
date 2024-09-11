'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Recours } from '@potentiel-domain/elimine';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: zod.instanceof(Blob).refine((data) => data.size > 0),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee },
) => {
  return withUtilisateur(async (utilisateur) => {
    const réponseSignéeValue = {
      content: reponseSignee.stream(),
      format: reponseSignee.type,
    };

    await mediator.send<Recours.AccorderRecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.AccorderRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAccordValue: new Date().toISOString(),
        réponseSignéeValue,
      },
    });

    return {
      status: 'success',
    };
  });
};

export const accorderRecoursAction = formAction(action, schema);
