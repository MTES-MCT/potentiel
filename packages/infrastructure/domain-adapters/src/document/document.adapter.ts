import {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  DéplacerDossierProjetPort,
  ArchiverDocumentProjetPort,
} from '@potentiel-domain/document';
import { download, upload, copyFolder, copyFile } from '@potentiel-libraries/file-storage';

export const téléchargerDocumentProjet: RécupérerDocumentProjetPort = download;
export const téléverserDocumentProjet: EnregistrerDocumentProjetPort = upload;
export const déplacerDossierProjet: DéplacerDossierProjetPort = copyFolder;
export const archiverDocumentProjet: ArchiverDocumentProjetPort = copyFile;

export { remplacerDocumentProjetSensible } from './remplacerDocumentProjetSensible.adapter';
