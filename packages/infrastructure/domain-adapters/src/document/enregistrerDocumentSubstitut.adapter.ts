import { Document } from '@potentiel-domain/projet';
import { upload } from '@potentiel-libraries/file-storage';

import { générerDocumentPdf } from './générerDocumentPdf.js';

export const enregistrerDocumentSubstitutAdapter: Document.EnregistrerDocumentSubstitutPort =
  async (documentProjet, raison) => {
    await upload(documentProjet.formatter(), await générerDocumentPdf(raison));
  };
