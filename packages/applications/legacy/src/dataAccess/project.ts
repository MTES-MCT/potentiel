import { Project } from '../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export interface ProjectFilters {
  isNotified?: boolean;
  isClasse?: boolean;
  isClaimed?: boolean;
  isAbandoned?: boolean;
  nomProjet?: string;
  appelOffreId?: AppelOffre.AppelOffreReadModel['id'] | AppelOffre.AppelOffreReadModel['id'][];
  periodeId?: AppelOffre.Periode['id'] | AppelOffre.Periode['id'][];
  familleId?: AppelOffre.Famille['id'] | AppelOffre.Famille['id'][];
  email?: Project['email'] | Project['email'][];
}
/**
 * @deprecated
 */
export type ProjectRepo = {
  /**
   * @deprecated
   */
  findById: (id: Project['id']) => Promise<Project | undefined>;
};
