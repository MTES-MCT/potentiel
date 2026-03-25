import { DocumentProjet } from '../../index.js';

import { AbandonDemandéEventV1 } from './demande/demander/demanderAbandon.event.js';

export const pièceJustificative = DocumentProjet.documentFactoryV3<AbandonDemandéEventV1>()(
  'abandon/pièce-justificative',
  'pièceJustificative',
  'demandéLe',
);

export const abandonAccordé = DocumentProjet.documentFactory(
  'abandon/abandon-accordé',
  'réponseSignée',
  'accordéLe',
);

export const abandonRejeté = DocumentProjet.documentFactory(
  'abandon/abandon-rejeté',
  'réponseSignée',
  'rejetéLe',
);

export const abandonAConfirmer = DocumentProjet.documentFactory(
  'abandon/abandon-à-confirmer',
  'réponseSignée',
  'confirmationDemandéeLe',
);
