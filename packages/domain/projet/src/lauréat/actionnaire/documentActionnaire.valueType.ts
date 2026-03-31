import { DocumentProjet } from '#document-projet';

const domaine = 'actionnaire';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'demandéLe',
});

export const changementAccordé = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'changement-accordé',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'accordéLe',
});
export const changementRejeté = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'changement-rejeté',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'rejetéLe',
});
