import { Entity } from '@potentiel-domain/entity';

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
      rejet: { rejetéLe: string; rejetéPar: string; courrierRejet: { format: string } };
    }>;
  }
>;
