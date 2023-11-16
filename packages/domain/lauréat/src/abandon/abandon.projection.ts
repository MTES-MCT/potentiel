import { Projection } from '@potentiel-libraries/projection';

export type AbandonProjection = Projection<
  'abandon',
  {
    identifiantProjet: string;
    nomProjet: string;

    appelOffre: string;
    période: string;
    famille?: string;

    statut: string;
    misÀJourLe: string;

    demandeRaison: string;
    demandePièceJustificativeFormat?: string;
    demandeRecandidature: boolean;
    preuveRecandidature?: string;
    preuveRecandidatureDemandéeLe?: string;
    demandeDemandéPar: string;
    demandeDemandéLe: string;

    accordRéponseSignéeFormat?: string;
    accordAccordéPar?: string;
    accordAccordéLe?: string;

    rejetRéponseSignéeFormat?: string;
    rejetRejetéPar?: string;
    rejetRejetéLe?: string;

    confirmationDemandéePar?: string;
    confirmationDemandéeLe?: string;
    confirmationDemandéeRéponseSignéeFormat?: string;
    confirmationConfirméLe?: string;
    confirmationConfirméPar?: string;
  }
>;

export type AbandonAvecRecandidatureSansPreuveProjection = Projection<
  'abandon-avec-recandidature-sans-preuve',
  {
    identifiantProjet: string;
    demandéeLe: string;
  }
>;
