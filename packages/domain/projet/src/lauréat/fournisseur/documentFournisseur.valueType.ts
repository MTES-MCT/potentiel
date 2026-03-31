import { DocumentProjet } from '#document-projet';

const domaine = 'fournisseur';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'enregistréLe',
});
