import { Unsubscribe } from '@potentiel-domain/core';
import {
  ConsulterAppelOffreDependencies,
  registerConsulterAppelOffreQuery,
} from './consulter/consulterAppelOffre.query';

// Setup
type AppelOffreQueryDependencies = ConsulterAppelOffreDependencies;

export type AppelOffreDependencies = AppelOffreQueryDependencies;

export const setupAppelOffreViews = async (dependencies: AppelOffreDependencies) => {
  // Queries
  registerConsulterAppelOffreQuery(dependencies);

  return [] as Array<Unsubscribe>;
};
