import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory(
  'producteur/pièce-justificative',
  'pièceJustificative',
  'enregistréLe',
);

export const pièceJustificativeModification = DocumentProjet.documentFactory(
  'producteur/pièce-justificative',
  'pièceJustificative',
  'modifiéLe',
);
