import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory(
  'abandon/pièce-justificative',
  'pièceJustificative',
  'demandéLe',
);

export const abandonAccordé = DocumentProjet.documentFactory(
  'abandon/abandon-accordé',
  'réponseSignée',
  'accordéLe',
);

export const abandonRejeté = DocumentProjet.documentFactory(
  'abandon/abandon-rejeté',
  'réponseSignée',
  'rejetéLe',
);

export const abandonAConfirmer = DocumentProjet.documentFactory(
  'abandon/abandon-à-confirmer',
  'réponseSignée',
  'confirmationDemandéeLe',
);
