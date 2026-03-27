import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory(
  'recours/pièce-justificative',
  'pièceJustificative',
  'demandéLe',
);

export const recoursAccordé = DocumentProjet.documentFactory(
  'recours/recours-accordé',
  'réponseSignée',
  'accordéLe',
);

export const recoursRejeté = DocumentProjet.documentFactory(
  'recours/recours-rejeté',
  'réponseSignée',
  'rejetéLe',
);
