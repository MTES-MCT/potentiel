'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  dateDesignation: zod.string().min(1),
  dateMiseEnService: zod.string().min(1, { message: 'Date à préciser' }),
});

export type TransmettreDateMiseEnServiceStateFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, dateMiseEnService, dateDesignation },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
    data: {
      identifiantProjetValue: identifiantProjet,
      référenceDossierValue: referenceDossier,
      dateMiseEnServiceValue: new Date(dateMiseEnService).toISOString(),
      dateDésignationValue: dateDesignation,
    },
  });

  return {
    status: 'success',
    redirectUrl: Routes.Raccordement.détail(identifiantProjet),
  };
};

export const transmettreDateMiseEnServiceAction = formAction(action, schema);
