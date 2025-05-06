'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Producteur } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { nomCandidatSchema } from '@/utils/zod/candidature/candidatureFields.schema';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  producteur: nomCandidatSchema,
});

export type ModifierProducteurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet, producteur }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Producteur.ModifierProducteurUseCase>({
      type: 'Lauréat.Producteur.UseCase.ModifierProducteur',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateModificationValue: new Date().toISOString(),
        producteurValue: producteur,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le changement de producteur a été pris en compte',
      },
    };
  });

export const modifierProducteurAction = formAction(action, schema);
