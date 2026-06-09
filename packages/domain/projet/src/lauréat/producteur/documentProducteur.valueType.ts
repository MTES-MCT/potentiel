import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine: 'producteur',
  typeDocument: 'pièce-justificative',
  nomChampDate: 'enregistréLe',
  nomChampDocument: 'pièceJustificative',
});

export const numéroIdentificationCorrigé = DocumentProjet.documentFactory({
  domaine: 'producteur',
  typeDocument: 'numéro-identification-corrigé',
  nomChampDate: 'corrigéLe',
  nomChampDocument: 'pièceJustificative',
});
