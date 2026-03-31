import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine: 'site-de-production',
  typeDocument: 'pièce-justificative',
  nomChampDate: 'modifiéLe',
  nomChampDocument: 'pièceJustificative',
});
