'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { installateurSchema } from '@/utils/candidature/candidatureFields.schema';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  installateur: installateurSchema,
});

export type ModifierInstallateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, installateur },
) =>
  withUtilisateur(async (utilisateur) => {
    if (installateur) {
      await mediator.send<Lauréat.Installateur.ModifierInstallateurUseCase>({
        type: 'Lauréat.Installateur.UseCase.ModifierInstallateur',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
          dateModificationValue: new Date().toISOString(),
          installateurValue: installateur,
        },
      });
    }

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: "Le changement d'installateur a été pris en compte",
      },
    };
  });

export const modifierInstallateurAction = formAction(action, schema);
