'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type AccorderRecoursFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Éliminé.Recours.AccorderRecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.AccorderRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAccordValue: new Date().toISOString(),
        réponseSignéeValue: reponseSignee,
      },
    });

    const { url } = getContext() ?? {};

    return {
      status: 'success',
      redirection: { url: url ?? Routes.Éliminé.détails(identifiantProjet) },
    };
  });
};

export const accorderRecoursAction = formAction(action, schema);
