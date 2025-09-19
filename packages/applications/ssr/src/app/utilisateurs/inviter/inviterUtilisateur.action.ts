'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { InviterUtilisateurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  role: zod.string(),
  identifiantUtilisateurInvite: zod.string(),
  region: zod.string().optional(),
  identifiantGestionnaireReseau: zod.string().optional(),
  nomComplet: zod.string().optional(),
  fonction: zod.string().optional(),
});

export type InviterUtilisateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    role,
    identifiantUtilisateurInvite,
    identifiantGestionnaireReseau,
    region,
    fonction,
    nomComplet,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<InviterUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.InviterUtilisateur',
      data: {
        identifiantUtilisateurValue: identifiantUtilisateurInvite,
        rôleValue: role,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: utilisateur.identifiantUtilisateur.formatter(),

        régionValue: region,
        identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
        fonctionValue: fonction,
        nomCompletValue: nomComplet,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Utilisateur.lister(), message: "L'utilisateur a été invité" },
    };
  });

export const inviterUtilisateurAction = formAction(action, schema);
