'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import type { Raccordement } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

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
  withUtilisateur(async ({ role, identifiantUtilisateur }) => {
    await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        nouvelleRéférenceDossierRaccordementValue: referenceDossierCorrigee,
        référenceDossierRaccordementActuelleValue: referenceDossier,
        rôleValue: role.nom,
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: role.aLaPermission('raccordement.consulter')
          ? Routes.Raccordement.détail(identifiantProjet)
          : Routes.Raccordement.lister,
        message: 'Référence du dossier de raccordement modifiée',
      },
    };
  });

export const corrigerRéférenceDossierAction = formAction(action, schema);
