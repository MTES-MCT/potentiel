import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine: 'typologie-installation',
  typeDocument: 'pièce-justificative',
  nomChampDate: 'enregistréLe',
  nomChampDocument: 'pièceJustificative',
});
