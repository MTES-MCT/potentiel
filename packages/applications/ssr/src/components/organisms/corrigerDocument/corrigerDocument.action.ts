'use server';

import * as zod from 'zod';

import { copyFile, upload } from '@potentiel-libraries/file-storage';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  pieceJustificative: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (_, props) => {
  // await copyFile
  await copyFile(props.identifiantProjet, props.identifiantProjet);

  // await upload
  await upload(props.identifiantProjet, props.pieceJustificative.stream());

  return {
    status: 'success',
  };
};

export const corrigerDocumentAction = formAction(action, schema);
