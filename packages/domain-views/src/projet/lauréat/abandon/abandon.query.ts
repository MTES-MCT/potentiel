import { ConsulterAbandonQuery } from './consulter/consulterAbandon.query';
import { ConsulterPièceJustificativeAbandonProjetQuery } from './consulter/consulterPièceJustificativeAbandon.query';
import { ListerAbandonsQuery } from './lister/listerAbandon.query';

export type AbandonQuery =
  | ConsulterAbandonQuery
  | ConsulterPièceJustificativeAbandonProjetQuery
  | ListerAbandonsQuery;

export {
  ConsulterAbandonQuery,
  ConsulterPièceJustificativeAbandonProjetQuery,
  ListerAbandonsQuery as ListerAbandonAvecRecandidatureQuery,
};
