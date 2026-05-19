import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime, Email } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet, Lauréat } from '../index.js';
import type { Fournisseur } from '../lauréat/fournisseur/index.js';
import type { DispositifDeStockage } from '../lauréat/installation/index.js';
import type {
  Coordonnées,
  HistoriqueAbandon,
  Localité,
  RaccordementDépôt,
  StatutCandidature,
  TypeActionnariat,
  TypeGarantiesFinancières,
  TypeTechnologie,
  TypologieInstallation,
  UnitéPuissance,
} from './index.js';

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
    famille: string;
    statut: StatutCandidature.RawType;
    nomProjet: string;
    typeGarantiesFinancières?: TypeGarantiesFinancières.RawType;
    historiqueAbandon: HistoriqueAbandon.RawType;
    localité: PlainType<Localité.ValueType>;
    coordonnées?: Coordonnées.RawType;
    nomCandidat: string;
    nomReprésentantLégal: string;
    emailContact: string;
    puissance: number;
    prixReference: number;
    // Peut valoir N/A pour les AOs avec une seule technologie
    technologie: TypeTechnologie.RawType;
    sociétéMère: string;
    noteTotale: number;
    motifÉlimination?: string;
    puissanceALaPointe: boolean;
    evaluationCarboneSimplifiée: number;
    actionnariat?: TypeActionnariat.RawType;
    dateÉchéanceGf?: DateTime.RawType;
    dateConstitutionGf?: DateTime.RawType;
    territoireProjet: string;
    fournisseurs: Array<Fournisseur.RawType>;
    coefficientKChoisi?: boolean;
    typologieInstallation: Array<TypologieInstallation.RawType>;
    installateur?: string;
    obligationDeSolarisation?: boolean;
    autorisation?: { numéro: string; date: DateTime.RawType };
    natureDeLExploitation?: {
      typeNatureDeLExploitation: Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.RawType;
      tauxPrévisionnelACI?: number;
      tauxPrévisionnelACC?: number;
    };
    puissanceDeSite?: number;

    miseÀJourLe: DateTime.RawType;

    // Plus spécifique que `technologie`, ne peut valoir N/A
    technologieCalculée: AppelOffre.Technologie;
    // Calculée à partir de la technologie et de l'appel d'offres
    unitéPuissance: UnitéPuissance.RawType;
    dispositifDeStockage?: DispositifDeStockage.RawType;
    raccordements?: Array<RaccordementDépôt.RawType>;
    puissanceDuProjetInitial?: number;
  } & (CandidatureNonNotifiée | CandidatureNotifiée)
>;
