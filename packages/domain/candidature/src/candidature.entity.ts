import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { HistoriqueAbandon, TypeTechnologie, TypeActionnariat } from './candidature';

export type CandidatureEntity = Entity<
  'candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    appelOffre: string;
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
    technologie: TypeTechnologie.RawType;
    sociétéMère: string;
    noteTotale: number;
    motifÉlimination?: string;
    puissanceALaPointe: boolean;
    evaluationCarboneSimplifiée: number;
    actionnariat?: TypeActionnariat.RawType;
    dateÉchéanceGf?: DateTime.RawType;
    territoireProjet: string;
    misÀJourLe: DateTime.RawType;
  }
>;
