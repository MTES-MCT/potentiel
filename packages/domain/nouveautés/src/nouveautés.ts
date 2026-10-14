import type {
  ListerNouveautésQuery,
  ListerNouveautésReadModel,
  NouveautéReadModel,
} from './lister/listerNouveautés.query.js';

// Query
export type NouveautésQuery = ListerNouveautésQuery;

// Port
export type * from './lister/listerNouveautés.port.js';
// Type
export type {
  LienNouveauté,
  Nouveauté,
  TypeDeLien,
} from './nouveauté.type.js';
export { typesDeLien } from './nouveauté.type.js';
// Register
export { registerNouveautésQueries } from './register.js';
// Read Models
export type { ListerNouveautésQuery, ListerNouveautésReadModel, NouveautéReadModel };
