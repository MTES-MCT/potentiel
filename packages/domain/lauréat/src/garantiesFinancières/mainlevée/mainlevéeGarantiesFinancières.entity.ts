import { Entity } from '@potentiel-domain/core';

export type MainlevéeGarantiesFinancièresEntity = Entity<
  'demande-mainlevee',
  {
    identifiantProjet: string;

    appelOffre: string;
    période: string;
    famille: string;

    nomProjet: string;
    régionProjet: string;

    statut: Demandé | EnCoursDInstruction | Accordé | Rejeté;

    motif: string;

    demandéLe: string;
    demandéPar: string;
  }
>;

type Demandé = {
  type: 'demandé';
};

type EnCoursDInstruction = {
  type: 'en-cours-d-instruction';
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
