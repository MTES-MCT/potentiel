'use server';

import * as zod from 'zod';

import { NotFoundError } from '@potentiel-domain/core';

import { FormAction, formAction, FormState } from '@/utils/formAction';

export type NewAppState = FormState;

const schema = zod.object({
  // identifiantProjet: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async () => {
  await sleep(2000);
  throw new NotFoundError('Pas trouvé !');
};

export const newAppAction = formAction(action, schema);

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
