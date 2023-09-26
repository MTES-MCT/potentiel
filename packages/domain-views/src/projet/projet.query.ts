import { ConsulterLegacyProjetQuery } from './consulter/consulterLegacyProjet.query';
import { ConsulterPiéceJustificativeAbandonProjetQuery } from './consulter/consulterPiéceJustificativeAbandon.query';
import { ConsulterProjetQuery } from './consulter/consulterProjet.query';
import { ListerProjetEnAttenteRecandidatureQuery } from './lister/listerProjetEnAttenteRecandidature.query';

// Queries
type ProjetQuery =
  | ConsulterLegacyProjetQuery
  | ConsulterProjetQuery
  | ConsulterPiéceJustificativeAbandonProjetQuery
  | ListerProjetEnAttenteRecandidatureQuery;

export {
  ProjetQuery,
  ConsulterLegacyProjetQuery,
  ConsulterProjetQuery,
  ConsulterPiéceJustificativeAbandonProjetQuery,
  ListerProjetEnAttenteRecandidatureQuery,
};
