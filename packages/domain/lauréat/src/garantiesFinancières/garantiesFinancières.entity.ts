import { Entity } from '@potentiel-domain/core';

export type GarantiesFinancièresEntity = Entity<'garanties-financieres', GarantiesFinancière>;

type GarantiesFinancière = GFAvecDateÉchéance | GFSansDateÉchéance;

type CommonGarantiesFinancière = {
  identifiantProjet: string;

  projet: {
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille: string;
  };

  soumisLe?: string;
  validéLe?: string;

  dateConstitution?: string;
  attestation?: {
    format: string;
  };

  miseÀJour: {
    dernièreMiseÀJourLe: string;
    dernièreMiseÀJourPar: string;
  };

  dépôtEnCours: DépôtEntity;
  mainlevée: Mainlevée;
};

type GFAvecDateÉchéance = CommonGarantiesFinancière & {
  typeGF: 'avec-date-échéance';
  dateÉchéance: string;
};

type GFSansDateÉchéance = CommonGarantiesFinancière & {
  typeGF: 'consignation' | 'six-mois-après-achèvement' | 'type-inconnu';
};

// Dépôt
export type DépôtEntity = AucunDépôt | DépôtAvecDateÉchéance | DépôtSansDateÉchéance;
type CommonDépôt = {
  dateConstitution: string;
  attestation: { format: string };

  soumisLe: string;

  miseÀJour: {
    dernièreMiseÀJourLe: string;
    dernièreMiseÀJourPar: string;
  };
};

type AucunDépôt = {
  type: 'aucun';
};

export type DépôtAvecDateÉchéance = CommonDépôt & {
  type: 'avec-date-échéance';
  dateÉchéance: string;
};

export type DépôtSansDateÉchéance = CommonDépôt & {
  type: 'consignation' | 'six-mois-après-achèvement' | 'type-inconnu';
};

// Mainlevée
type Mainlevée =
  | AucuneMainlevée
  | MainlevéeDemandée
  | MainlevéeEnInstruction
  | MainlevéeAccordée
  | MainlevéeRejetée;

type CommonMainlevée = {
  motif: string;

  demande: {
    demandéLe: string;
    demandéPar: string;
  };

  miseÀJour: {
    dernièreMiseÀJourLe: string;
    dernièreMiseÀJourPar: string;
  };

  instructionsRejetées: Array<MainlevéeRejetée>;
};

type AucuneMainlevée = {
  statut: 'aucun';
};

export type MainlevéeDemandée = CommonMainlevée & {
  statut: 'demandé';
};

export type MainlevéeEnInstruction = CommonMainlevée & {
  statut: 'en-instruction';
  instructionDémarréPar: string;
  instructionDémarréLe: string;
};

export type MainlevéeAccordée = CommonMainlevée & {
  statut: 'accordé';
  accordéLe: string;
  accordéPar: string;
  courrierRéponse: {
    format: string;
  };
};

export type MainlevéeRejetée = CommonMainlevée & {
  statut: 'rejeté';
  rejetéLe: string;
  rejetéPar: string;
  courrierRéponse: {
    format: string;
  };
};
