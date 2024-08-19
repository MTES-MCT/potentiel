import {
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import { copyFolder, upload, download } from '@potentiel-libraries/file-storage';

export const setupDocumentProjet = () => {
  registerDocumentProjetQueries({
    récupérerDocumentProjet: download,
  });

  registerDocumentProjetCommand({
    enregistrerDocumentProjet: upload,
    déplacerDossierProjet: copyFolder,
  });
};
