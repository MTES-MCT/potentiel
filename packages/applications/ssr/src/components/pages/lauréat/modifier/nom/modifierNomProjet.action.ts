'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  nomProjet: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type ModifierNomProjetFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet, nomProjet }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ModifierLauréatUseCase>({
      type: 'Lauréat.UseCase.ModifierLauréat',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomProjetValue: nomProjet,
        modifiéLeValue: new Date().toISOString(),
        modifiéParValue: utilisateur.identifiantUtilisateur.email,
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
