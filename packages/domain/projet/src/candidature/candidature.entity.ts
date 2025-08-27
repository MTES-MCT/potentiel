import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Entity } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { IdentifiantProjet } from '..';
import { Fournisseur } from '../lauréat/fournisseur';

import {
  HistoriqueAbandon,
  Localité,
  StatutCandidature,
  TypeActionnariat,
  TypeGarantiesFinancières,
  TypeTechnologie,
  TypologieInstallation,
} from '.';

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
    statut: StatutCandidature.RawType;
    nomProjet: string;
    typeGarantiesFinancières?: TypeGarantiesFinancières.RawType;
    historiqueAbandon: HistoriqueAbandon.RawType;
    localité: PlainType<Localité.ValueType>;
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
    dateDélibérationGf?: DateTime.RawType;
    territoireProjet: string;
    misÀJourLe: DateTime.RawType;
    coefficientKChoisi?: boolean;
    élémentsSousOmbrière?: string;
    obligationDeSolarisation?: boolean;
    détailsMisÀJourLe: DateTime.RawType;
    fournisseurs: Array<Fournisseur.RawType>;
    typologieInstallation: Array<TypologieInstallation.RawType>;
  } & (CandidatureNonNotifiée | CandidatureNotifiée)
>;
