import {
  ConsulterAppelOffreQuery,
  ConsulterAppelOffreReadModel,
} from './consulter/consulterAppelOffre.query';
import { ListerAppelOffreQuery, ListerAppelOffreReadModel } from './lister/listerAppelOffre.query';

// Query
export type AppelOffreQuery = ListerAppelOffreQuery & ConsulterAppelOffreQuery;
export { ListerAppelOffreQuery, ConsulterAppelOffreQuery };

// Read Models
export { ListerAppelOffreReadModel, ConsulterAppelOffreReadModel };

// Register
export * from './register';

// Projection
export * from './appelOffre.entity';
