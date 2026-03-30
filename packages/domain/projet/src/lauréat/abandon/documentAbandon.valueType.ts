import { DocumentProjet } from '#document-projet';

const domaine = 'abandon';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'demandéLe',
});

export const abandonAccordé = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'abandon-accordé',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'accordéLe',
});

export const abandonRejeté = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'abandon-rejeté',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'rejetéLe',
});

export const abandonAConfirmer = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'abandon-à-confirmer',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'confirmationDemandéeLe',
});
