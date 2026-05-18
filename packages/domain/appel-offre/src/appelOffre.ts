import type {
  ConsulterAppelOffreQuery,
  ConsulterAppelOffreReadModel,
} from './consulter/consulterAppelOffre.query.js';
import type {
  ListerAppelOffreQuery,
  ListerAppelOffreReadModel,
} from './lister/listerAppelOffre.query.js';
import * as RéférenceCahierDesCharges from './référenceCahierDesCharges.valueType.js';

// Query
export type AppelOffreQuery = ListerAppelOffreQuery & ConsulterAppelOffreQuery;

// Entity
export * from './appelOffre.entity.js';
// Register
export * from './register.js';
// Read Models
export type {
  ConsulterAppelOffreQuery,
  ConsulterAppelOffreReadModel,
  ListerAppelOffreQuery,
  ListerAppelOffreReadModel,
};
// ValueType
export { RéférenceCahierDesCharges };

/** @deprecated use RéférenceCahierDesCharges.RawType */
export type CahierDesChargesRéférence = RéférenceCahierDesCharges.RawType;
