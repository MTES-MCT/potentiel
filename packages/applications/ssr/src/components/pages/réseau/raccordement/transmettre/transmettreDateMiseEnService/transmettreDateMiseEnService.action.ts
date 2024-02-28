'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type transmettreDateMiseEnServiceState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  dateDesignation: zod.string().min(1),
  dateMiseEnService: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
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
  };
};

export const transmettreDateMiseEnServiceAction = formAction(action, schema);
