import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

import { HistoriqueAbandon, Technologie } from './candidature';

type GarantiesFinancièresAvecDateÉchéance = {
  typeGarantiesFinancières: 'avec-date-échéance';
  dateÉchéanceGf: DateTime.RawType;
};
type GarantiesFinancièresSansDateÉchéance = {
  typeGarantiesFinancières: 'consignation' | 'six-mois-après-achèvement' | 'type-inconnu';
};

type CandidatureClassée = {
  statut: 'classé';
} & (GarantiesFinancièresAvecDateÉchéance | GarantiesFinancièresSansDateÉchéance);
type CandidatureÉliminée = {
  statut: 'éliminé';
};

export type CandidatureEntityData = {
  identifiantProjet: IdentifiantProjet.RawType;
  nomProjet: string;
  historiqueAbandon: HistoriqueAbandon.RawType;
  adresse1: string;
  adresse2: string;
  nomCandidat: string;
  nomReprésentantLégal: string;
  emailContact: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  valeurÉvaluationCarbone?: number;
  technologie: Technologie.RawType;
  codePostal: string;
  commune: string;
  sociétéMère: string;
  noteTotale: number;
  motifÉlimination: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  financementCollectif: boolean;
  financementParticipatif: boolean;
  gouvernancePartagée: boolean;
  territoireProjet: string;
} & (CandidatureClassée | CandidatureÉliminée);

export type CandidatureEntity = Entity<'candidature', CandidatureEntityData>;
