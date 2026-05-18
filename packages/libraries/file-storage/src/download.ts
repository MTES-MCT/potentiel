import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { FichierInexistant } from './fichierInexistant.error.js';

export const download = async (filePath: string): Promise<ReadableStream> => {
  try {
    // const result = await getClient().send(
    //   new GetObjectCommand({ Bucket: getBucketName(), Key: filePath }),
    // );

    // if (!result.Body) {
    //   throw new FichierInexistant(filePath);
    // }

    const result = await executeSelect<{ content: Buffer }>(
      `select content from document_store.files where key = $1`,
      filePath,
    );

    if (!result?.length) {
      throw new FichierInexistant(filePath);
    }

    return ReadableStream.from(result[0].content.toString('utf-8'));

    // return result.Body.transformToWebStream();
  } catch {
    throw new FichierInexistant(filePath);
  }
};
