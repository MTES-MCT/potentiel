'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  installationAvecDispositifDeStockage: zod.stringbool(),
});

export type ModifierDispositifDeStockageFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, installationAvecDispositifDeStockage },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.DispositifDeStockage.ModifierDispositifDeStockageUseCase>({
      type: 'Lauréat.DispositifDeStockage.UseCase.ModifierDispositifDeStockage',
      data: {
        identifiantProjetValue: identifiantProjet,
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
        modifiéLeValue: new Date().toISOString(),
        dispositifDeStockageValue: { installationAvecDispositifDeStockage },
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le changement de dispositif de stockage a été pris en compte',
      },
    };
  });

export const modifierDispositifDeStockageAction = formAction(action, schema);
