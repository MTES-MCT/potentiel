import { DocumentProjet } from '#document-projet';

const domaine = 'délai';
export const pièceJustificative = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'demandéLe',
});

export const demandeAccordée = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'demande-accordée',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'accordéLe',
});

export const demandeRejetée = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'demande-rejetée',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'rejetéeLe',
});
