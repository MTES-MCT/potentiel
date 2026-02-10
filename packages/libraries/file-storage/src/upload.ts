import { Upload } from '@aws-sdk/lib-storage';

import { getBucketName } from './getBucketName.js';
import { getClient } from './getClient.js';

/**
 *
 * @todo ici la key devrait être un IdentifiantDocumentProjet et la
 * fonction upload a la responsabilité de créer le chemin de fichier et les caractères spéciaux interdit
 */
export const upload = async (filePath: string, content: ReadableStream) => {
  await new Upload({
    client: getClient(),
    params: {
      Bucket: getBucketName(),
      Key: filePath,
      Body: content,
    },
  }).done();
};
