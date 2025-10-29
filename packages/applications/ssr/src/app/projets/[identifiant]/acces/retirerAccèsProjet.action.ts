'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { Accès } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { formAction, FormAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantUtilisateurRetire: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, identifiantUtilisateurRetire },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Accès.RetirerAccèsProjetUseCase>({
      type: 'Projet.Accès.UseCase.RetirerAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: identifiantUtilisateurRetire,
        retiréLeValue: DateTime.now().formatter(),
        retiréParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });
    return {
      status: 'success',
      redirection: {
        url: Routes.Accès.lister(identifiantProjet),
        message: "L'accès au projet a été retiré avec succès",
      },
    };
  });

export const retirerAccèsProjetAction = formAction(action, schema);
