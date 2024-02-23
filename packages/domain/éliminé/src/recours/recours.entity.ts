import { Entity } from '@potentiel-domain/core';

export type RecoursEntity = Entity<
  'recours',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: Array<string>;

    appelOffre: string;
    période: string;
    famille?: string;

    statut: string;
    misÀJourLe: string;

    demandeDemandéPar: string;
    demandeDemandéLe: string;
    demandeRaison: string;
    demandePièceJustificativeFormat?: string;

    accordRéponseSignéeFormat?: string;
    accordAccordéPar?: string;
    accordAccordéLe?: string;

    rejetRéponseSignéeFormat?: string;
    rejetRejetéPar?: string;
    rejetRejetéLe?: string;
  }
>;
