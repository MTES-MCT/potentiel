import { ConsulterLegacyProjetQuery } from './consulter/consulterLegacyProjet.query';
import { ConsulterProjetQuery } from './consulter/consulterProjet.query';
import { ListerProjetEnAttenteRecandidatureQuery } from './lister/listerProjetEnAttenteRecandidature.query';

// Queries
type ProjetQuery =
  | ConsulterLegacyProjetQuery
  | ConsulterProjetQuery
  | ListerProjetEnAttenteRecandidatureQuery;

export {
  ProjetQuery,
  ConsulterLegacyProjetQuery,
  ConsulterProjetQuery,
  ListerProjetEnAttenteRecandidatureQuery,
};
