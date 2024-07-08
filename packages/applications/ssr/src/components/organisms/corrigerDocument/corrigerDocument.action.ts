'use server';

import * as zod from 'zod';

import { copyFile, upload } from '@potentiel-libraries/file-storage';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  documentCorrige: zod.instanceof(Blob),
  documentKey: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, props) => {
  await copyFile(props.documentKey, props.documentKey + new Date().toISOString());

  await upload(props.documentKey, props.documentCorrige.stream());

  return {
    status: 'success',
  };
};

export const corrigerDocumentAction = formAction(action, schema);
