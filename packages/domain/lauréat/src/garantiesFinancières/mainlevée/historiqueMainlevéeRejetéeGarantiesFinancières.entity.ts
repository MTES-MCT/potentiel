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
      id: string;
      motif: string;
      demande: { demandéeLe: string; demandéePar: string };
      rejet: { rejetéLe: string; rejetéPar: string; courrierRejet: { format: string } };
    }>;
  }
>;
