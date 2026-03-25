import { ZodError } from 'zod';

import { mergeDocuments } from '@potentiel-libraries/pdf';

export const mergePdfDocuments = async (documents: Blob[]) => {
  try {
    if (documents.length === 1) {
      return documents[0];
    }

    return await mergeDocuments(documents);
  } catch (error) {
    throw new ZodError([
      {
        code: 'custom',
        path: ['piecesJustificatives'],
        message: error instanceof Error ? error.message : 'Une erreur est survenue',
      },
    ]);
  }
};
