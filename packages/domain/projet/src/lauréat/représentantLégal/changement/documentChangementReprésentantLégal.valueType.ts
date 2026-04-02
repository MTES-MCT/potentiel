import { DocumentProjet } from '#document-projet';

const domaine = 'représentant-légal';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'demandéLe',
});
