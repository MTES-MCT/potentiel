import { ConsulterAbandonQuery } from './consulter/consulterAbandon.query';
import { ConsulterPiéceJustificativeAbandonProjetQuery } from './consulter/consulterPiéceJustificativeAbandon.query';
import { ListerAbandonsQuery } from './lister/listerAbandon.query';

export type AbandonQuery =
  | ConsulterAbandonQuery
  | ConsulterPiéceJustificativeAbandonProjetQuery
  | ListerAbandonsQuery;

export {
  ConsulterAbandonQuery,
  ConsulterPiéceJustificativeAbandonProjetQuery,
  ListerAbandonsQuery as ListerAbandonAvecRecandidatureQuery,
};
