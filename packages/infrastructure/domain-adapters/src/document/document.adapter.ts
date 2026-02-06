import { Document } from '@potentiel-domain/projet';
import { download, upload, copyFolder, copyFile } from '@potentiel-libraries/file-storage';

export const téléchargerDocumentProjet: Document.RécupérerDocumentProjetPort = download;
export const téléverserDocumentProjet: Document.EnregistrerDocumentProjetPort = upload;
export const déplacerDossierProjet: Document.DéplacerDossierProjetPort = copyFolder;
export const archiverDocumentProjet: Document.ArchiverDocumentProjetPort = copyFile;

export { enregistrerDocumentSubstitutAdapter } from './enregistrerDocumentSubstitut.adapter.js';
