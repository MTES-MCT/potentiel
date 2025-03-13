'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { RetirerAccèsProjetUseCase } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { formAction, FormAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantUtilisateurRetire: zod.string().min(1, { message: 'Champ obligatoire' }),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, identifiantUtilisateurRetire },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<RetirerAccèsProjetUseCase>({
      type: 'Utilisateur.UseCase.RetirerAccèsProjet',
      data: {
        identifiantProjet,
        identifiantUtilisateur: identifiantUtilisateurRetire,
        retiréLe: DateTime.now().formatter(),
        retiréPar: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Utilisateur.listerPorteurs(identifiantProjet),
        message: "L'accès au projet a été retiré avec succès",
      },
    };
  });

export const retirerAccèsProjetAction = formAction(action, schema);
