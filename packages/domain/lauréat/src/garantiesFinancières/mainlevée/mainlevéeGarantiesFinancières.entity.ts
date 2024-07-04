import { Entity } from '@potentiel-domain/core';

export type MainlevéeGarantiesFinancièresEntity = Entity<
  'mainlevee-garanties-financieres',
  {
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
  } & (Demandé | EnInstruction | Accordé | Rejeté)
>;

type Demandé = {
  statut: 'demandé';
};

type EnInstruction = {
  statut: 'en-instruction';
  instructionDémarréPar: string;
  instructionDémarréLe: string;
};

type Accordé = {
  statut: 'accordé';
  accordéLe: string;
  accordéPar: string;
  courrierRéponse: {
    format: string;
  };
};

type Rejeté = {
  statut: 'rejeté';
  rejetéLe: string;
  rejetéPar: string;
  courrierRéponse: {
    format: string;
  };
};
