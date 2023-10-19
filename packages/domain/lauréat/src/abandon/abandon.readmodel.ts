import { ReadModel } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import * as Abandon from './abandon.valueType';
import * as StatutAbandon from './statutAbandon.valueType';

export type AbandonReadModelKey = `abandon|${IdentifiantProjet.RawType}`;

export type AbandonReadModel = ReadModel<
  'abandon',
  {
    identifiantDemande: Abandon.RawType;
    identifiantProjet: IdentifiantProjet.RawType;

    statut: StatutAbandon.RawType;

    demandeRaison: string;
    demandePièceJustificativeFormat?: string;
    demandeRecandidature: boolean;
    demandeDemandéLe: DateTime.RawType;

    accordRéponseSignéeFormat?: string;
    accordAccordéLe?: DateTime.RawType;

    rejetRéponseSignéeFormat?: string;
    rejetRejetéLe?: DateTime.RawType;

    confirmationDemandéeLe?: DateTime.RawType;
    confirmationDemandéeRéponseSignéeFormat?: string;
    confirmationConfirméLe?: DateTime.RawType;
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
