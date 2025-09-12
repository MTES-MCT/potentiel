'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { booleanSchema } from '@/utils/candidature/schemaBase';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  installationAvecDispositifDeStockage: booleanSchema,
});

export type ModifierInstallationAvecDispositifDeStockageFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, installationAvecDispositifDeStockage },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.InstallationAvecDispositifDeStockage.ModifierInstallationAvecDispositifDeStockageUseCase>(
      {
        type: 'Lauréat.InstallationAvecDispositifDeStockage.UseCase.ModifierInstallationAvecDispositifDeStockage',
        data: {
          identifiantProjetValue: identifiantProjet,
          modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
          modifiéeLeValue: new Date().toISOString(),
          installationAvecDispositifDeStockageValue: installationAvecDispositifDeStockage,
        },
      },
    );

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: "Le changement d'installation avec dispositif de stockage a été pris en compte",
      },
    };
  });

export const modifierInstallationAvecDispositifDeStockageAction = formAction(action, schema);
