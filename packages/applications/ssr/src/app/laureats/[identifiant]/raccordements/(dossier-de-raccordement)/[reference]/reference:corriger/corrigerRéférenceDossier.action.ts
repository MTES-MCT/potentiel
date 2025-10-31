'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type CorrigerRéférenceDossierFormKeys = keyof zod.infer<typeof schema>;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  referenceDossierCorrigee: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = (
  _,
  { identifiantProjet, referenceDossier, referenceDossierCorrigee },
) =>
  withUtilisateur(async ({ rôle, identifiantUtilisateur }) => {
    await mediator.send<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        nouvelleRéférenceDossierRaccordementValue: referenceDossierCorrigee,
        référenceDossierRaccordementActuelleValue: referenceDossier,
        rôleValue: rôle.nom,
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: rôle.aLaPermission('raccordement.consulter')
          ? Routes.Raccordement.détail(identifiantProjet)
          : Routes.Raccordement.lister,
        message: 'La référence du dossier de raccordement a été modifiée',
      },
    };
  });

export const corrigerRéférenceDossierAction = formAction(action, schema);
