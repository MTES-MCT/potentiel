'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { RéactiverUtilisateurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantUtilisateurReactive: zod.string().min(1),
  actif: zod.stringbool().optional(),
});

export type RéactiverUtilisateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantUtilisateurReactive, actif },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<RéactiverUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.RéactiverUtilisateur',
      data: {
        identifiantUtilisateurValue: identifiantUtilisateurReactive,
        réactivéLeValue: DateTime.now().formatter(),
        réactivéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Utilisateur.lister({ actif }),
        message: "L'utilisateur a été réactivé",
      },
    };
  });

export const réactiverUtilisateurAction = formAction(action, schema);
