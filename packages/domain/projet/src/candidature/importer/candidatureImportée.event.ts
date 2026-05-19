import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet, Lauréat } from '../../index.js';
import type { Fournisseur } from '../../lauréat/fournisseur/index.js';
import type { Raccordement } from '../../lauréat/index.js';
import type * as HistoriqueAbandon from '../historiqueAbandon.valueType.js';
import type { TypologieInstallation } from '../index.js';
import type * as StatutCandidature from '../statutCandidature.valueType.js';
import type * as TypeActionnariat from '../typeActionnariat.valueType.js';
import type * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType.js';
import type * as TypeTechnologie from '../typeTechnologie.valueType.js';

type CandidatureImportéeEventPayload = {
  identifiantProjet: IdentifiantProjet.RawType;
  statut: StatutCandidature.RawType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.RawType;
  historiqueAbandon: HistoriqueAbandon.RawType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissance: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: Email.RawType;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  coordonnées?: {
    latitude: number;
    longitude: number;
  };
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  puissanceDuProjetInitial?: number;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.RawType;
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
  };
  puissanceDeSite?: number;
  importéLe: DateTime.RawType;
  importéPar: Email.RawType;
  raccordements?: Array<{
    référence: Raccordement.RéférenceDossierRaccordement.RawType;
    dateQualification: DateTime.RawType;
  }>;
};

/**
 * @deprecated Ajoute les informations fournisseurs à une candidature importée avec CandidatureImportée-V1
 * Tous les évènements CandidatureImportée-V1 doivent avoir un évènement DétailsFournisseursCandidatureImportés-V1 associé
 */
export type DétailsFournisseursCandidatureImportésEvent = DomainEvent<
  'DétailsFournisseursCandidatureImportés-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    fournisseurs: CandidatureImportéeEventPayload['fournisseurs'];
  }
>;

/**
 * @deprecated Remplacé par CandidatureImportée-V2 qui ajoute les fournisseurs
 * L'évènement DétailsFournisseursCandidatureImportés-V1 permet d'ajouter les valeurs manquantes pour les candidatures importées avec la V1
 */
export type CandidatureImportéeEventV1 = DomainEvent<
  'CandidatureImportée-V1',
  Omit<CandidatureImportéeEventPayload, 'fournisseurs' | 'typologieInstallation'>
>;

export type CandidatureImportéeEvent = DomainEvent<
  'CandidatureImportée-V2',
  CandidatureImportéeEventPayload
>;
