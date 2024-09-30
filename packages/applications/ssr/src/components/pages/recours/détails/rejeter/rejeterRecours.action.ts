'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Recours } from '@potentiel-domain/elimine';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: document,
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Recours.RecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.RejeterRecours',
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

    return {
      status: 'success',
      redirectUrl: Routes.Recours.détail(identifiantProjet),
    };
  });
};

export const rejeterRecoursAction = formAction(action, schema);
