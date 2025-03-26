import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { StatutProjet, IdentifiantProjet } from '..';

import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
import * as TypeTechnologie from './typeTechnologie.valueType';
import * as TypeActionnariat from './typeActionnariat.valueType';
import * as HistoriqueAbandon from './historiqueAbandon.valueType';

type CandidatureNonNotifiée = {
  estNotifiée: false;
  notification?: undefined;
};

type CandidatureNotifiée = {
  estNotifiée: true;
  notification: {
    notifiéeLe: DateTime.RawType;
    notifiéePar: Email.RawType;
    validateur: AppelOffre.Validateur;
    attestation?: {
      généréeLe: DateTime.RawType;
      format: string;
    };
  };
};

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
    détailsMisÀJourLe: DateTime.RawType;
  } & (CandidatureNonNotifiée | CandidatureNotifiée)
>;
