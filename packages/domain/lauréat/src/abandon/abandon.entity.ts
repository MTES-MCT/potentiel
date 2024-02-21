import { Entity } from '@potentiel-domain/core';

export type AbandonEntity = Entity<
  'abandon',
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
    demandeRecandidature: boolean;
    preuveRecandidatureStatut: string;
    preuveRecandidature?: string;
    preuveRecandidatureDemandéeLe?: string;
    preuveRecandidatureTransmiseLe?: string;
    preuveRecandidatureTransmisePar?: string;

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

export type AbandonAvecRecandidatureSansPreuveProjection = Entity<
  'abandon-avec-recandidature-sans-preuve',
  {
    identifiantProjet: string;
    demandéeLe: string;
  }
>;
