'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) => {
  return withUtilisateur(async (utilisateur) => {
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
        url: Routes.Abandon.détail(identifiantProjet),
      },
    };
  });
};

export const passerAbandonEnInstructionAction = formAction(action, schema);
