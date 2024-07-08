'use server';

import path from 'node:path';

import * as zod from 'zod';

import { copyFile, upload } from '@potentiel-libraries/file-storage';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  documentCorrige: zod.instanceof(Blob),
  documentKey: zod.string().min(1),
});

// nous gardons l'ancien fichier stocké pour l'historique avec un timestamp
const action: FormAction<FormState, typeof schema> = async (_, props) => {
  const { extension, fileBaseName } = splitFileName(props.documentKey);

  await copyFile(
    props.documentKey,
    `${fileBaseName}.snapshot-${new Date().toISOString()}.${extension}`,
  );

  await upload(props.documentKey, props.documentCorrige.stream());

  return {
    status: 'success',
  };
};

export const corrigerDocumentAction = formAction(action, schema);

const splitFileName = (fileName: string) => {
  return { fileBaseName: path.dirname(fileName), extension: path.extname(fileName) };
};
