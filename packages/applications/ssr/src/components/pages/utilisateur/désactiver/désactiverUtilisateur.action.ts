'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { headers } from 'next/headers';

import { DésactiverUtilisateurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantUtilisateurDesactive: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type DésactiverUtilisateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantUtilisateurDesactive },
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
        url: headers().get('referer') ?? Routes.Utilisateur.lister({ actif: false }),
        message: "L'utilisateur a été désactivé",
      },
    };
  });

export const désactiverUtilisateurAction = formAction(action, schema);
