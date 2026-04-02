import { DocumentProjet } from '#document-projet';

const domaine = 'demande-mainlevee';

export const demandeAccordée = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'accord-demande-mainlevee',
  nomChampDate: 'accordéLe',
  nomChampDocument: 'réponseSignée',
});

export const demandeRejetée = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'rejet-demande-mainlevee',
  nomChampDate: 'rejetéLe',
  nomChampDocument: 'réponseSignée',
});
