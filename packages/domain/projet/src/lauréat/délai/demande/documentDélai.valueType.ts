import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory(
  'délai/pièce-justificative',
  'pièceJustificative',
  'demandéLe',
);

export const demandeAccordée = DocumentProjet.documentFactory(
  'délai/demande-accordée',
  'réponseSignée',
  'accordéLe',
);

export const demandeRejetée = DocumentProjet.documentFactory(
  'délai/demande-rejetée',
  'réponseSignée',
  'rejetéeLe',
);
