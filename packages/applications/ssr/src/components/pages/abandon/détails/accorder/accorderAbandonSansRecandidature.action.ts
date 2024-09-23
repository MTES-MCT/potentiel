'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { validateDocumentSize } from '@/utils/zod/documentValidation';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: zod
    .instanceof(Blob)
    .superRefine((file, ctx) => validateDocumentSize(file, ctx, 'la réponse signée')),
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

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAccordValue: new Date().toISOString(),
        réponseSignéeValue,
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Abandon.détail(identifiantProjet),
    };
  });
};

export const accorderAbandonSansRecandidatureAction = formAction(action, schema);
