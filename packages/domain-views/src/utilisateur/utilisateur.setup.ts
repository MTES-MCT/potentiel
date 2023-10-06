import { Unsubscribe } from '@potentiel/core-domain';
import {
  ConsulterUtilisateurLegacyDependencies,
  registerConsulterUtilisateurLegacyQuery,
} from './consulter/consulterUtilisateurLegacy.query';

export type UtilisateurDependencies = ConsulterUtilisateurLegacyDependencies;

export const setupUtilisateurViews = async (dependencies: UtilisateurDependencies) => {
  registerConsulterUtilisateurLegacyQuery(dependencies);

  return [] as Array<Unsubscribe>;
};
