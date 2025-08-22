'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import type { DésactiverUtilisateurUseCase } from '@potentiel-domain/utilisateur';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantUtilisateurDesactive: zod.string().min(1, { message: 'Champ obligatoire' }),
  actif: zod
    .enum(['', 'true', 'false'])
    .optional()
    .transform((actif) => (actif === 'true' ? true : actif === 'false' ? false : undefined)),
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
