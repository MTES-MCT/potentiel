import { DocumentProjet } from '#document-projet';

const domaine = 'installateur';
export const pièceJustificative = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'enregistréeLe',
});
