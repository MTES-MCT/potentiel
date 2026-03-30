import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine: 'producteur',
  typeDocument: 'pièce-justificative',
  nomChampDate: 'enregistréLe',
  nomChampDocument: 'pièceJustificative',
});
