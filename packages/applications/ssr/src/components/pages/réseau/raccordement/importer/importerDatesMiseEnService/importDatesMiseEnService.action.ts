'use server';

import * as zod from 'zod';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ImporterDatesMiseEnServiceState = FormState;

const schema = zod.object({
  fichierDatesMiseEnService: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (previousState, {}) => {
  /**
   * @todo faire la migration de cette partie dans le domain raccordement
   */

  return previousState;
};

export const importerDatesMiseEnServiceAction = formAction(action, schema);
