import { DocumentProjet } from '#document-projet';

const domaine = 'dispositif-de-stockage';
export const pièceJustificative = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'enregistréLe',
});
