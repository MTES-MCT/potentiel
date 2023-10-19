import { ReadModel } from '@potentiel-domain/core';
import { RawType } from './abandon.valueType';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { StatutAbandon } from './statusAbandon.valueType';

export type AbandonReadModelKey = `abandon|${IdentifiantProjet.RawType}`;

export type AbandonReadModel = ReadModel<
  'abandon',
  {
    identifiantDemande: RawType;
    identifiantProjet: IdentifiantProjet.RawType;

    statut: StatutAbandon;

    demandeRaison: string;
    demandePièceJustificativeFormat?: string;
    demandeRecandidature: boolean;
    demandeDemandéLe: string;

    accordRéponseSignéeFormat?: string;
    accordAccordéLe?: string;

    rejetRéponseSignéeFormat?: string;
    rejetRejetéLe?: string;

    confirmationDemandéeLe?: string;
    confirmationDemandéeRéponseSignéeFormat?: string;
    confirmationConfirméLe?: string;
  }
>;

export type PièceJustificativeAbandonReadModel = ReadModel<
  'pièce-justificative-abandon',
  { format: string; content: ReadableStream }
>;

export type RéponseSignéeAbandonReadModel = ReadModel<
  'réponse-signée-abandon',
  { format: string; content: ReadableStream }
>;
