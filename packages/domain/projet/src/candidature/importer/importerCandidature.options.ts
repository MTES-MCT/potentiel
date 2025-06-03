import { DateTime, Email } from '@potentiel-domain/common';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import * as TypeTechnologie from '../typeTechnologie.valueType';
import * as TypeActionnariat from '../typeActionnariat.valueType';
import * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import { TypeFournisseur } from '../../lauréat/fournisseur';

export type ImporterCandidatureOptions = {
  statut: StatutCandidature.ValueType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixRéférence: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: Email.ValueType;
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
  technologie: TypeTechnologie.ValueType;
  actionnariat?: TypeActionnariat.ValueType;
  dateÉchéanceGf?: DateTime.ValueType;
  territoireProjet: string;
  coefficientKChoisi?: boolean;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
  fournisseurs: Array<{
    typeFournisseur: TypeFournisseur.ValueType;
    nomDuFabricant: string;
  }>;
};
