import type {
  ConsulterAppelOffreQuery,
  ConsulterAppelOffreReadModel,
} from './consulter/consulterAppelOffre.query';
import type {
  ListerAppelOffreQuery,
  ListerAppelOffreReadModel,
} from './lister/listerAppelOffre.query';

// Query
export type AppelOffreQuery = ListerAppelOffreQuery & ConsulterAppelOffreQuery;
export type { ListerAppelOffreQuery, ConsulterAppelOffreQuery };

// Read Models
export type { ListerAppelOffreReadModel, ConsulterAppelOffreReadModel };

// Register
export * from './register';

// Entity
export * from './appelOffre.entity';
