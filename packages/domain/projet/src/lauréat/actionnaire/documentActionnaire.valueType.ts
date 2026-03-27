import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory(
  'actionnaire/pièce-justificative',
  'pièceJustificative',
  'demandéLe',
);

export const pièceJustificativeModification = DocumentProjet.documentFactory(
  'actionnaire/pièce-justificative',
  'pièceJustificative',
  'modifiéLe',
);

export const changementAccordé = DocumentProjet.documentFactory(
  'actionnaire/changement-accordé',
  'réponseSignée',
  'accordéLe',
);
export const changementRejeté = DocumentProjet.documentFactory(
  'actionnaire/changement-rejeté',
  'réponseSignée',
  'rejetéLe',
);
