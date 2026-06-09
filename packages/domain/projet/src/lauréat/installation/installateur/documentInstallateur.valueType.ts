import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine: 'installateur',
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'enregistréLe',
});
