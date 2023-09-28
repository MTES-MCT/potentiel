import { ConsulterPiéceJustificativeAbandonProjetQuery } from './consulter/consulterPiéceJustificativeAbandon.query';
import { ListerAbandonAvecRecandidatureQuery } from './lister/listerAbandonAvecRecandidature.query';

export type AbandonQuery =
  | ConsulterPiéceJustificativeAbandonProjetQuery
  | ListerAbandonAvecRecandidatureQuery;

export {
  ConsulterPiéceJustificativeAbandonProjetQuery,
  ListerAbandonAvecRecandidatureQuery as ListerProjetEnAttenteRecandidatureQuery,
};
