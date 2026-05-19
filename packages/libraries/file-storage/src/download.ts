import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { FichierInexistant } from './fichierInexistant.error.js';

export const download = async (filePath: string): Promise<ReadableStream> => {
  const result = await executeSelect<{ content: Buffer }>(
    `select content from document_store.files where key = $1`,
    filePath,
  );

  if (!result?.length) {
    throw new FichierInexistant(filePath);
  }

  return ReadableStream.from([result[0].content]);
};
