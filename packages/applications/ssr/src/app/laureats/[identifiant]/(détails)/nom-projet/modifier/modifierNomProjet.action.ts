'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  nomProjet: zod.string(),
});
export type ModifierNomProjetFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet, nomProjet }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ModifierNomProjetUseCase>({
      type: 'Lauréat.UseCase.ModifierNomProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomProjetValue: nomProjet,
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
        modifiéLeValue: DateTime.now().formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le nom du projet a été modifié',
      },
    };
  });

export const modifierNomProjetAction = formAction(action, schema);
