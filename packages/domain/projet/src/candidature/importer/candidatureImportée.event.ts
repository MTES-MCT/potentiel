import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import * as TypeTechnologie from '../typeTechnologie.valueType';
import * as TypeActionnariat from '../typeActionnariat.valueType';
import * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import { IdentifiantProjet } from '../..';
import { Fournisseur } from '../../lauréat/fournisseur';
import { TypeInstallationsAgrivoltaiques, TypologieBâtiment } from '..';

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
