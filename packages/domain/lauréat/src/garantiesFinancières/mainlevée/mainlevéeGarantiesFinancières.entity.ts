import { Entity } from '@potentiel-domain/core';

export type MainlevéeGarantiesFinancièresEntity = Entity<
  'mainlevee-garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;

    statut: string;
    motif: string;
    demande: { demandéeLe: string; demandéePar: string };
    instruction?: { démarréeLe: string; démarréePar: string };
    accord?: { accordéeLe: string; accordéePar: string; courrierAccord: { format: string } };
    rejet?: { refuséeLe: string; refuséePar: string; courrierRejet: { format: string } };

    dernièreMiseÀJour: {
      date: string;
      par: string;
    };
  }
>;
