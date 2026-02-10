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
export type { ListerAppelOffreQuery, ConsulterAppelOffreQuery };

// Read Models
export type { ListerAppelOffreReadModel, ConsulterAppelOffreReadModel };

// Register
export * from './register.js';

// Entity
export * from './appelOffre.entity.js';

// ValueType
export { RéférenceCahierDesCharges };

/** @deprecated use RéférenceCahierDesCharges.RawType */
export type CahierDesChargesRéférence = RéférenceCahierDesCharges.RawType;
