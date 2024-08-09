'use server';

import * as zod from 'zod';

import { FormAction, formAction, FormState } from '@/utils/formAction';

export type AjouterGestionnaireRéseauState = FormState;

const schema = zod.object({
  appelOffre: zod.string().min(1),
  periode: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, props) => {
  console.log(props);
  return {
    status: 'success',
  };
};

export const importCandidaturesAction = formAction(action, schema);
