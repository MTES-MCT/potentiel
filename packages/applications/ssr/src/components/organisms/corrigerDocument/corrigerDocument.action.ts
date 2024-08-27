'use server';

import * as zod from 'zod';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  documentCorrige: zod.instanceof(Blob),
  documentKey: zod.string().min(1),
});

// nous gardons l'ancien fichier stocké pour l'historique avec un timestamp
const action: FormAction<FormState, typeof schema> = async (_, { documentKey }) => {
  return {
    status: 'success',
  };
};

export const corrigerDocumentAction = formAction(action, schema);
