import { Document } from '@potentiel-domain/projet';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';

export const setupDocumentProjet = () => {
  Document.registerDocumentProjetQueries({
    récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
  });

  Document.registerDocumentProjetCommand({
    enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
    déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
    archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
    enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
  });
};
