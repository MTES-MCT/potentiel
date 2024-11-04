import { Entity } from '@potentiel-domain/entity';

type DétailsMainlevée = {
  statut: string;
  motif: string;
  appelOffre: string;
  demande: { demandéeLe: string; demandéePar: string };
  instruction?: { démarréeLe: string; démarréePar: string };
  accord?: { accordéeLe: string; accordéePar: string; courrierAccord: { format: string } };
  rejet?: { rejetéLe: string; rejetéPar: string; courrierRejet: { format: string } };
  dernièreMiseÀJour: {
    date: string;
    par: string;
  };
};

export type MainlevéeGarantiesFinancièresEntity = Entity<
  'mainlevee-garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;

    mainlevées: Array<DétailsMainlevée>;
  }
>;
