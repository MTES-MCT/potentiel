import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { HistoriqueAbandon, Technologie } from './candidature';

export type CandidatureEntity = Entity<
  'candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: StatutProjet.RawType;
    nomProjet: string;
    typeGarantiesFinancières?: GarantiesFinancières.TypeGarantiesFinancières.RawType;
    historiqueAbandon: HistoriqueAbandon.RawType;
    adresse1: string;
    adresse2: string;
    nomCandidat: string;
    nomReprésentantLégal: string;
    emailContact: string;
    puissanceProductionAnnuelle: number;
    prixReference: number;
    valeurÉvaluationCarbone?: number;
    technologie: Technologie.RawType;
    codePostal: string;
    commune: string;
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
  }
>;
