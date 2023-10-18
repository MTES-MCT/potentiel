import { ConsulterAbandonQuery } from './consulter/consulterAbandon.query';
import { ConsulterPièceJustificativeAbandonProjetQuery } from './consulter/consulterPièceJustificativeAbandon.query';
import { ConsulterRéponseSignéeAbandonQuery } from './consulter/consulterRéponseSignéeAbandon.query';
import { ListerAbandonsQuery } from './lister/listerAbandon.query';

export type AbandonQuery =
  | ConsulterAbandonQuery
  | ConsulterPièceJustificativeAbandonProjetQuery
  | ConsulterRéponseSignéeAbandonQuery
  | ListerAbandonsQuery;

export {
  ConsulterAbandonQuery,
  ConsulterPièceJustificativeAbandonProjetQuery,
  ConsulterRéponseSignéeAbandonQuery,
  ListerAbandonsQuery,
};
