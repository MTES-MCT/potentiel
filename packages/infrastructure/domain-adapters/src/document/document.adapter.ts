import type {
  ArchiverDocumentProjetPort,
  DéplacerDossierProjetPort,
  EnregistrerDocumentProjetPort,
  RécupérerDocumentProjetPort,
} from '@potentiel-domain/document';
import { copyFile, copyFolder, download, upload } from '@potentiel-libraries/file-storage';

export const téléchargerDocumentProjet: RécupérerDocumentProjetPort = download;
export const téléverserDocumentProjet: EnregistrerDocumentProjetPort = upload;
export const déplacerDossierProjet: DéplacerDossierProjetPort = copyFolder;
export const archiverDocumentProjet: ArchiverDocumentProjetPort = copyFile;

export { remplacerDocumentProjetSensible } from './remplacerDocumentProjetSensible.adapter';
