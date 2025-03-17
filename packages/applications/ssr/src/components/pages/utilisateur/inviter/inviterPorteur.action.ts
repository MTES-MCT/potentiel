'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantUtilisateurInvite: zod.string().min(1, { message: 'Champ obligatoire' }),
  inviterATousSesProjets: zod.literal('true').optional(),
});

export type InviterPorteurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, identifiantUtilisateurInvite, inviterATousSesProjets },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<InviterPorteurUseCase>({
      type: 'Utilisateur.UseCase.InviterPorteur',
      data: {
        identifiantsProjetValues: [identifiantProjet],
        identifiantUtilisateurValue: identifiantUtilisateurInvite,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: utilisateur.identifiantUtilisateur.formatter(),
        inviteATousSesProjetsValue: inviterATousSesProjets === 'true',
      },
    });

    return {
      status: 'success',
      redirection: {
        message: 'Utilisateur invité avec succès',
        url: Routes.Utilisateur.listerPorteurs(
          IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
        ),
      },
    };
  });

export const inviterPorteurAction = formAction(action, schema);
