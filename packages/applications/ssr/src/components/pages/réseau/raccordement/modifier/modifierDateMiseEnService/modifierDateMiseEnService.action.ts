'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  dateMiseEnService: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type ModifierDateMiseEnServiceStateFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, dateMiseEnService },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'Réseau.Raccordement.UseCase.ModifierDateMiseEnService',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierValue: referenceDossier,
      dateMiseEnServiceValue: new Date(dateMiseEnService).toISOString(),
    },
  });

  return {
    status: 'success',
    redirect: { url: Routes.Raccordement.détail(identifiantProjet) },
  };
};

export const modifierDateMiseEnServiceAction = formAction(action, schema);
