import { DocumentProjet } from '#document-projet';

const domaine = 'recours';

export const pièceJustificative = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'pièce-justificative',
  nomChampDocument: 'pièceJustificative',
  nomChampDate: 'demandéLe',
});

export const recoursAccordé = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'recours-accordé',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'accordéLe',
});

export const recoursRejeté = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'recours-rejeté',
  nomChampDocument: 'réponseSignée',
  nomChampDate: 'rejetéLe',
});
