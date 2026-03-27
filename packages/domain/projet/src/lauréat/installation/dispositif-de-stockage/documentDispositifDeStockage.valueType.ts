import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory(
  'dispositif-de-stockage/pièce-justificative',
  'pièceJustificative',
  'enregistréLe',
);

export const pièceJustificativeModification = DocumentProjet.documentFactory(
  'dispositif-de-stockage/pièce-justificative',
  'pièceJustificative',
  'modifiéLe',
);
