import { DateTime, Email, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
import { HistoriqueAbandon, TypeTechnologie, TypeActionnariat } from './candidature';

export type CandidatureEntity = Entity<
  'candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    appelOffre: string;
    période: string;
    statut: StatutProjet.RawType;
    nomProjet: string;
    typeGarantiesFinancières?: TypeGarantiesFinancières.RawType;
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

    notification?: {
      estNotifiée: true;
      notifiéeLe: DateTime.RawType;
      notifiéePar: Email.RawType;
      validateur: {
        fonction: string;
        nomComplet: string;
      };
    };
  }
>;
