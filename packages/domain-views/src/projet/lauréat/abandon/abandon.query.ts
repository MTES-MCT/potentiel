import { ConsulterAbandonQuery } from './consulter/consulterAbandon.query';
import { ConsulterPiéceJustificativeAbandonProjetQuery } from './consulter/consulterPiéceJustificativeAbandon.query';
import { ListerAbandonAvecRecandidatureQuery } from './lister/listerAbandonAvecRecandidature.query';

export type AbandonQuery =
  | ConsulterAbandonQuery
  | ConsulterPiéceJustificativeAbandonProjetQuery
  | ListerAbandonAvecRecandidatureQuery;

export {
  ConsulterAbandonQuery,
  ConsulterPiéceJustificativeAbandonProjetQuery,
  ListerAbandonAvecRecandidatureQuery,
};
