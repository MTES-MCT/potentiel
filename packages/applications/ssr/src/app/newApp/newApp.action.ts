'use server';

import * as zod from 'zod';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { NotFoundError } from '@potentiel-domain/core';

export type NewAppState = FormState;

const schema = zod.object({
  // identifiantProjet: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (previousState, _) => {
  await sleep(2000);
  throw new NotFoundError('Pas trouvé !');
  return previousState;
};

export const newAppAction = formAction(action, schema);

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
