import {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
} from '@potentiel-domain/document';
import { download, upload } from '@potentiel/file-storage';

export const téléchargerDocumentProjet: RécupérerDocumentProjetPort = download;
export const téléverserDocumentProjet: EnregistrerDocumentProjetPort = async (
  documentKey,
  content,
) => {
  await upload(documentKey, content);
};
