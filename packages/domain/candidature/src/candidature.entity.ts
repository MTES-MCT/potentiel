import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { HistoriqueAbandon, Technologie } from './candidature';

export type CandidatureEntity = Entity<
  'candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    appelOffre: string;
    période: string;
    statut: StatutProjet.RawType;
    nomProjet: string;
    typeGarantiesFinancières?: GarantiesFinancières.TypeGarantiesFinancières.RawType;
    historiqueAbandon: HistoriqueAbandon.RawType;
    localité: {
      adresse1: string;
      adresse2: string;
      codePostal: string;
      commune: string;
      département: string;
      région: string;
    };
    nomCandidat: string;
    nomReprésentantLégal: string;
    emailContact: string;
    puissanceProductionAnnuelle: number;
    prixReference: number;
    valeurÉvaluationCarbone?: number;
    technologie: Technologie.RawType;
    sociétéMère: string;
    noteTotale: number;
    motifÉlimination: string;
    puissanceALaPointe: boolean;
    evaluationCarboneSimplifiée: number;
    financementCollectif: boolean;
    financementParticipatif: boolean;
    gouvernancePartagée: boolean;
    dateÉchéanceGf?: DateTime.RawType;
    territoireProjet: string;
    misÀJourLe: DateTime.RawType;

    notification?: {
      notifiéLe: DateTime.RawType;
    };
  }
>;
