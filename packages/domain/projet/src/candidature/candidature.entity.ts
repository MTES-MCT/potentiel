import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Entity } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { StatutProjet, IdentifiantProjet } from '..';
import { Fournisseur } from '../lauréat/fournisseur';

import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
import * as TypeTechnologie from './typeTechnologie.valueType';
import * as TypeActionnariat from './typeActionnariat.valueType';
import * as HistoriqueAbandon from './historiqueAbandon.valueType';
import * as Localité from './localité.valueType';

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
    territoireProjet: string;
    misÀJourLe: DateTime.RawType;
    coefficientKChoisi?: boolean;
    typeInstallationsAgrivoltaiques?: string;
    élémentsSousOmbrière?: string;
    typologieDeBâtiment?: string;
    obligationDeSolarisation?: boolean;
    détailsMisÀJourLe: DateTime.RawType;
    fournisseurs: Array<Fournisseur.RawType>;
  } & (CandidatureNonNotifiée | CandidatureNotifiée)
>;
