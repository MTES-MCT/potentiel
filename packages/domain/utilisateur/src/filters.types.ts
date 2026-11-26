import type { AppelOffre } from '@potentiel-domain/appel-offre';

export type FiltersType = {
  technologie: AppelOffre.Technologie[];
  cycle: AppelOffre.Cycle[];
};
