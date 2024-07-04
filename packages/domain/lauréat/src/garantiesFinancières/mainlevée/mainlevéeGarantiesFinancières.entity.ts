import { Entity } from '@potentiel-domain/core';

type Common = {
  identifiantProjet: string;
  appelOffre: string;
  période: string;
  famille: string;
  nomProjet: string;
  régionProjet: string;
  dernièreMiseÀJourLe: string;
  dernièreMiseÀJourPar: string;
  motif: string;
  demandéLe: string;
  demandéPar: string;
};

export type MainlevéeGarantiesFinancièresEntity = Entity<
  'mainlevee-garanties-financieres',
  Demandé | EnInstruction | Accordé | Rejeté
>;

type Demandé = Common & {
  statut: 'demandé';
};

type EnInstruction = Common & {
  statut: 'en-instruction';
  instructionDémarréPar: string;
  instructionDémarréLe: string;
};

type Accordé = Common & {
  statut: 'accordé';
  accordéLe: string;
  accordéPar: string;
  courrierRéponse: {
    format: string;
  };
};

type Rejeté = Common & {
  statut: 'rejeté';
  rejetéLe: string;
  rejetéPar: string;
  courrierRéponse: {
    format: string;
  };
};
