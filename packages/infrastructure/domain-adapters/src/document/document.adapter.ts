import {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  DéplacerDossierProjetPort,
  GénérerModèleDocumentPort,
} from '@potentiel-domain/document';
import { download, upload, copyFolder } from '@potentiel-libraries/file-storage';
import { buildDocxDocument } from '@potentiel-infrastructure/document-builder';

export const téléchargerDocumentProjet: RécupérerDocumentProjetPort = download;
export const téléverserDocumentProjet: EnregistrerDocumentProjetPort = upload;
export const déplacerDossierProjet: DéplacerDossierProjetPort = copyFolder;
export const générerModèleDocument: GénérerModèleDocumentPort = buildDocxDocument;
