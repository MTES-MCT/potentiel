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
    déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
    archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
    supprimerDocumentProjetSensible: DocumentAdapter.supprimerDocumentProjetSensible,
  });
};
