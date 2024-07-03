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

    statut: Demandé | EnInstruction | Accordé | Rejeté;

    motif: string;

    demandéLe: string;
    demandéPar: string;

    dateMiseÀJour: string;
    misÀJourPar: string;
  }
>;

type Demandé = {
  type: 'demandé';
};

type EnInstruction = {
  type: 'en-instruction';
  instructionDémarréPar: string;
  instructionDémarréLe: string;
};

type Accordé = {
  type: 'accordé';
  accordéLe: string;
  accordéPar: string;
  courrierRéponse: {
    format: string;
  };
};

type Rejeté = {
  type: 'rejeté';
  rejetéLe: string;
  rejetéPar: string;
  courrierRéponse: {
    format: string;
  };
};
