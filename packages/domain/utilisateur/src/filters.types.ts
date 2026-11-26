import type { AppelOffre } from '@potentiel-domain/appel-offre';

export type UserFiltersType = {
  technologie: AppelOffre.Technologie[];
  cycle: AppelOffre.Cycle[];
};
