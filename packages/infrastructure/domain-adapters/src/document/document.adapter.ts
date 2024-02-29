import {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  DéplacerDossierProjetPort,
} from '@potentiel-domain/document';
import { download, upload, copyFolder } from '@potentiel/file-storage';

export const téléchargerDocumentProjet: RécupérerDocumentProjetPort = download;
export const téléverserDocumentProjet: EnregistrerDocumentProjetPort = upload;
export const déplacerDossierProjet: DéplacerDossierProjetPort = copyFolder;
