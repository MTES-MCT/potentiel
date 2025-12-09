'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) =>
  withUtilisateur(async (utilisateur) => {
    const { url } = getContext() ?? {};

    await mediator.send<Lauréat.Abandon.PasserEnInstructionAbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.PasserAbandonEnInstruction',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        rôleUtilisateurValue: utilisateur.rôle.nom,
        dateInstructionValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: url ?? Routes.Abandon.détailRedirection(identifiantProjet),
      },
    };
  });

export const passerAbandonEnInstructionAction = formAction(action, schema);
