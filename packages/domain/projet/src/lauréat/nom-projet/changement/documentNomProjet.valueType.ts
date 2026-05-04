import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine: 'nom-projet',
  typeDocument: 'pièce-justificative',
  nomChampDate: 'enregistréLe',
  nomChampDocument: 'pièceJustificative',
});
