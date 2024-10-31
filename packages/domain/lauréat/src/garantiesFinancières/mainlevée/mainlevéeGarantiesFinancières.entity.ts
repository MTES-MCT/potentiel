import { Entity } from '@potentiel-domain/entity';

export type MainlevéeEnCours = {
  statut: 'demandé' | 'en-instruction' | 'accordé';
  motif: string;
  demande: { demandéeLe: string; demandéePar: string };
  instruction?: { démarréeLe: string; démarréePar: string };
  accord?: { accordéeLe: string; accordéePar: string; courrierAccord: { format: string } };
  dernièreMiseÀJour: {
    date: string;
    par: string;
  };
};

export type MainlevéeRejetée = {
  statut: 'rejeté';
  motif: string;
  demande: { demandéeLe: string; demandéePar: string };
  rejet: { rejetéLe: string; rejetéPar: string; courrierRejet: { format: string } };
  dernièreMiseÀJour: {
    date: string;
    par: string;
  };
};

export type MainlevéesArray = Array<MainlevéeRejetée> | [MainlevéeEnCours, ...MainlevéeRejetée[]];

export type MainlevéeGarantiesFinancièresEntity = Entity<
  'mainlevee-garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;

    mainlevées: MainlevéesArray;
  }
>;
