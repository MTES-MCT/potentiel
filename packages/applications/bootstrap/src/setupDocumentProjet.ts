import {
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';

export const setupDocumentProjet = () => {
  registerDocumentProjetQueries({
    récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
  });

  registerDocumentProjetCommand({
    enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
    déplacerDocumentProjet: DocumentAdapter.déplacerDocumentProjet,
  });
};
