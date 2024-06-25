import { Entity } from '@potentiel-domain/core';

export type HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity = Entity<
  'historique-mainlevee-rejetee-garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;

    historique: Array<{
      motif: string;
      demande: { demandéeLe: string; demandéePar: string };
      rejet: { rejetéeLe: string; rejetéePar: string; courrierRejet: { format: string } };
      dernièreMiseÀJour: {
        date: string;
        par: string;
      };
    }>;
  }
>;
