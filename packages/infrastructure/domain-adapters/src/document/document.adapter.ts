import {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  DéplacerDocumentProjetPort,
} from '@potentiel-domain/document';
import { download, copyFile, upload } from '@potentiel/file-storage';

export const téléchargerDocumentProjet: RécupérerDocumentProjetPort = download;
export const téléverserDocumentProjet: EnregistrerDocumentProjetPort = upload;
export const déplacerDocumentProjet: DéplacerDocumentProjetPort = copyFile;
