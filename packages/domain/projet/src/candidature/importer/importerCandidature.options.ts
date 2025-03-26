import { DateTime, Email } from '@potentiel-domain/common';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import * as TypeTechnologie from '../typeTechnologie.valueType';
import * as TypeActionnariat from '../typeActionnariat.valueType';
import * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import { IdentifiantProjet } from '../..';

export type ImporterCandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
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
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
