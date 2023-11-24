import {
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { buildDocument } from '@potentiel-infrastructure/document-builder';

export const setupDocumentProjet = () => {
  registerDocumentProjetQueries({
    récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
    générerRéponseAccordAbandonAvecRecandidature: buildDocument,
  });

  registerDocumentProjetCommand({
    enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
  });
};
