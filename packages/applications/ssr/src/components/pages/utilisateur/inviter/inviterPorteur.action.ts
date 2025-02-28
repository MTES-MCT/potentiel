'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantUtilisateurInvite: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type InviterPorteurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, identifiantUtilisateurInvite },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<InviterPorteurUseCase>({
      type: 'Utilisateur.UseCase.InviterPorteur',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: identifiantUtilisateurInvite,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Raccordement.détail(identifiantProjet),
        message: "L'utilisateur a été invité sur le projet",
      },
    };
  });

export const inviterPorteurAction = formAction(action, schema);
