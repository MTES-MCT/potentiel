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
  usecase: zod.enum(['transmettre', 'modifier']),
});

export type EnregistrerDateMiseEnServiceStateFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, dateMiseEnService, usecase },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type:
      usecase === 'modifier'
        ? 'Réseau.Raccordement.UseCase.ModifierDateMiseEnService'
        : 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierValue: referenceDossier,
      dateMiseEnServiceValue: new Date(dateMiseEnService).toISOString(),
    },
  });

  return {
    status: 'success',
    redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
  };
};

export const enregistrerDateMiseEnServiceAction = formAction(action, schema);
