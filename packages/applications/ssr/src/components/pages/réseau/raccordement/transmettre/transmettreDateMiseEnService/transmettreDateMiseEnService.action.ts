'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type transmettreDateMiseEnServiceState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  referenceDossier: zod.string(),
  dateDesignation: zod.string(),
  dateMiseEnService: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, referenceDossier, dateMiseEnService, dateDesignation },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
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
