import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../..';
import type { Fournisseur } from '../../lauréat/fournisseur';
import type { TypeInstallationsAgrivoltaiques, TypologieBâtiment } from '..';
import type * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import type * as StatutCandidature from '../statutCandidature.valueType';
import type * as TypeActionnariat from '../typeActionnariat.valueType';
import type * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import type * as TypeTechnologie from '../typeTechnologie.valueType';

type CandidatureImportéeEventPayload = {
  identifiantProjet: IdentifiantProjet.RawType;
  statut: StatutCandidature.RawType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.RawType;
  historiqueAbandon: HistoriqueAbandon.RawType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
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
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.RawType;
  actionnariat?: TypeActionnariat.RawType;
  dateÉchéanceGf?: DateTime.RawType;
  dateDélibérationGf?: DateTime.RawType;
  territoireProjet: string;
  coefficientKChoisi?: boolean;
  puissanceDeSite?: number;
  typeInstallationsAgrivoltaiques?: TypeInstallationsAgrivoltaiques.RawType;
  élémentsSousOmbrière?: string;
  typologieDeBâtiment?: TypologieBâtiment.RawType;
  obligationDeSolarisation?: boolean;
  fournisseurs: Array<Fournisseur.RawType>;
  importéLe: DateTime.RawType;
  importéPar: Email.RawType;
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
  Omit<CandidatureImportéeEventPayload, 'fournisseurs'>
>;

export type CandidatureImportéeEvent = DomainEvent<
  'CandidatureImportée-V2',
  CandidatureImportéeEventPayload
>;
