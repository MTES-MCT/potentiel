import { Entity } from '@potentiel-domain/entity';

// discriminated union

type DétailsMainlevée = {
  identifiantProjet: string;
  appelOffre: string;
  nomProjet: string;
  statut: string;
  motif: string;
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

    projet: {
      nomProjet: string;
      appelOffre: string;
      période: string;
      famille?: string;
      régionProjet: string;
    };

    détailsMainlevées: Array<DétailsMainlevée>;
  }
>;

export type DétailsMainlevéeGarantiesFinancièresEntity = Entity<
  'détails-mainlevee-garanties-financieres',
  DétailsMainlevée
>;
