'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  dateMiseEnService: zod.string().min(1),
});

export type ModifierDateMiseEnServiceStateFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, dateMiseEnService },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Raccordement.ModifierDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue: referenceDossier,
        dateMiseEnServiceValue: new Date(dateMiseEnService).toISOString(),
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
    };
  });

export const modifierDateMiseEnServiceAction = formAction(action, schema);
