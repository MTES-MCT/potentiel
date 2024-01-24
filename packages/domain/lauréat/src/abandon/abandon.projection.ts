import { Projection } from '@potentiel-libraries/projection';

// TODO: Doit on doit vraiment nommé les entités avec Projection, sachant que cela indique qu'on fait de l'ES dans l'infrastructure ???
export type AbandonProjection = Projection<
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

export type AbandonAvecRecandidatureSansPreuveProjection = Projection<
  'abandon-avec-recandidature-sans-preuve',
  {
    identifiantProjet: string;
    demandéeLe: string;
  }
>;
