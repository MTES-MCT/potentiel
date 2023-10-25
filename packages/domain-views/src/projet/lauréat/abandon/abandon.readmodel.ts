import { ReadModel } from '@potentiel/core-domain-views';
import {
  RawIdentifiantDemandeAbandon,
  RawIdentifiantProjet,
  StatutAbandon,
} from '@potentiel/domain-usecases';

export type AbandonReadModelKey = `abandon|${RawIdentifiantProjet}`;

export type AbandonReadModel = ReadModel<
  'abandon',
  {
    identifiantDemande: RawIdentifiantDemandeAbandon;
    identifiantProjet: RawIdentifiantProjet;

    statut: StatutAbandon;

    //flatten organization to optimize complex query. Will be revised soon
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
