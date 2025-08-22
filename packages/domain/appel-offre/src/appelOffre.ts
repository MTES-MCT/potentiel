import type {
  ConsulterAppelOffreQuery,
  ConsulterAppelOffreReadModel,
} from './consulter/consulterAppelOffre.query';
import type {
  ListerAppelOffreQuery,
  ListerAppelOffreReadModel,
} from './lister/listerAppelOffre.query';
import * as RéférenceCahierDesCharges from './référenceCahierDesCharges.valueType';

// Query
export type AppelOffreQuery = ListerAppelOffreQuery & ConsulterAppelOffreQuery;
export type { ListerAppelOffreQuery, ConsulterAppelOffreQuery };

// Read Models
export type { ListerAppelOffreReadModel, ConsulterAppelOffreReadModel };

// Entity
export * from './appelOffre.entity';
// Register
export * from './register';

// ValueType
export { RéférenceCahierDesCharges };

/** @deprecated use RéférenceCahierDesCharges.RawType */
export type CahierDesChargesRéférence = RéférenceCahierDesCharges.RawType;
