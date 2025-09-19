'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { DésactiverUtilisateurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantUtilisateurDesactive: zod.string(),
  actif: zod.stringbool().optional(),
});

export type DésactiverUtilisateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantUtilisateurDesactive, actif },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<DésactiverUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.DésactiverUtilisateur',
      data: {
        identifiantUtilisateurValue: identifiantUtilisateurDesactive,
        désactivéLeValue: DateTime.now().formatter(),
        désactivéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Utilisateur.lister({ actif }),
        message: "L'utilisateur a été désactivé",
      },
    };
  });

export const désactiverUtilisateurAction = formAction(action, schema);
