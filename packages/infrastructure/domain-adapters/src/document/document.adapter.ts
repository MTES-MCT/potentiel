import {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  DéplacerDossierProjetPort,
  SupprimerDocumentProjetPort,
} from '@potentiel-domain/document';
import { download, upload, copyFolder, deleteFile } from '@potentiel/file-storage';

export const téléchargerDocumentProjet: RécupérerDocumentProjetPort = download;
export const téléverserDocumentProjet: EnregistrerDocumentProjetPort = upload;
export const déplacerDossierProjet: DéplacerDossierProjetPort = copyFolder;
export const supprimerDocumentProjet: SupprimerDocumentProjetPort = deleteFile;
