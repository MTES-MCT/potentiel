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
  identifiantUtilisateurInvite: zod.string().min(1, { message: 'Champ obligatoire' }),
  region: zod.string().optional(),
  identifiantGestionnaireReseau: zod.string().optional(),
});

export type InviterUtilisateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { role, identifiantUtilisateurInvite, identifiantGestionnaireReseau, region },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<InviterUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.InviterUtilisateur',
      data: {
        identifiantUtilisateurValue: identifiantUtilisateurInvite,
        rôleValue: role,
        région: region,
        identifiantGestionnaireRéseau: identifiantGestionnaireReseau,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Utilisateur.lister, message: "L'utilisateur a été invité" },
    };
  });

export const inviterUtilisateurAction = formAction(action, schema);
