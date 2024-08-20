'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';

import { FormAction, formAction, FormState } from '@/utils/formAction';

export type NotifierCandidaturesState = FormState;

const schema = zod.object({
  periode: zod.string(),
  appelOffre: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (_, { appelOffre, periode }) => {
  // await mediator.send<Candidature.ImporterCandidatureUseCase>({
  //   type: 'Candidature.UseCase.ImporterCandidature',
  //   data: {},
  // });
  console.log('Notification', { appelOffre, periode });

  return {
    status: 'success',
    result: {
      successCount: -1,
      errors: [],
    },
  };
};

export const notifierCandidaturesAction = formAction(action, schema);
