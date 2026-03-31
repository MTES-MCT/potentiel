import { DocumentProjet } from '#document-projet';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine: 'puissance',
  typeDocument: 'pièce-justificative',
  nomChampDate: 'demandéLe',
  nomChampDocument: 'pièceJustificative',
});

export const changementAccordé = DocumentProjet.documentFactory({
  domaine: 'puissance',
  typeDocument: 'changement-accordé',
  nomChampDate: 'accordéLe',
  nomChampDocument: 'réponseSignée',
});

export const changementRejeté = DocumentProjet.documentFactory({
  domaine: 'puissance',
  typeDocument: 'changement-rejeté',
  nomChampDate: 'rejetéLe',
  nomChampDocument: 'réponseSignée',
});
