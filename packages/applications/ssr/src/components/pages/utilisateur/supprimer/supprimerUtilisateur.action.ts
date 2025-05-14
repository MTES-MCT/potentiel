'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { SupprimerUtilisateurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantUtilisateurSupprime: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type SupprimerUtilisateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantUtilisateurSupprime },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<SupprimerUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.SupprimerUtilisateur',
      data: {
        identifiantUtilisateurValue: identifiantUtilisateurSupprime,
        suppriméLeValue: DateTime.now().formatter(),
        suppriméParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Utilisateur.lister, message: "L'utilisateur a été supprimé" },
    };
  });

export const supprimerUtilisateurAction = formAction(action, schema);
