import { DocumentProjet } from '../../index.js';

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
