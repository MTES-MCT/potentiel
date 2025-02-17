import { Entity } from '@potentiel-domain/entity';

export type MainlevéeGarantiesFinancièresEntity = Entity<
  'mainlevee-garanties-financieres',
  {
    identifiantProjet: string;

    projet: {
      nom: string;
      appelOffre: string;
      période: string;
      famille?: string;
      numéroCRE: string;
      région: string;
    };

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
  }
>;
