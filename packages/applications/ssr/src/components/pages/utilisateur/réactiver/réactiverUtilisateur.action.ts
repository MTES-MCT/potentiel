'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { headers } from 'next/headers';

import { RéactiverUtilisateurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantUtilisateurReactive: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type RéactiverUtilisateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantUtilisateurReactive },
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
        url: headers().get('referer') ?? Routes.Utilisateur.lister({ actif: true }),
        message: "L'utilisateur a été réactivé",
      },
    };
  });

export const réactiverUtilisateurAction = formAction(action, schema);
