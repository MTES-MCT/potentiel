'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) =>
  withUtilisateur(async (utilisateur) => {
    const { url } = getContext() ?? {};

    await mediator.send<Lauréat.Abandon.ConfirmerAbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.ConfirmerAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateConfirmationValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: url ?? Routes.Abandon.détailRedirection(identifiantProjet),
      },
    };
  });

export const confirmerAbandonAction = formAction(action, schema);
