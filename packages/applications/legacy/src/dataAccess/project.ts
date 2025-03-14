import { Project, User } from '../entities';
import { Région } from '../modules/dreal/région';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ResultAsync } from '../types';
import { PaginatedList, Pagination } from '../modules/pagination';

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

export type ContextSpecificProjectListFilter =
  | {
      isNotified: boolean;
    }
  | {
      userId: User['id'];
    }
  | {
      regions: Région | Région[];
    };
/**
 * @deprecated
 */
export type ProjectRepo = {
  /**
   * @deprecated
   */
  findById: (id: Project['id']) => Promise<Project | undefined>;
  /**
   * @deprecated
   */
  findOne(query: Record<string, any>): Promise<Project | undefined>;
  /**
   * @deprecated
   */
  searchForRegions(
    regions: Région | Région[],
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>>;
  /**
   * @deprecated
   */
  findAllForRegions(
    regions: Région | Région[],
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>>;
  /**
   * @deprecated
   */
  searchAll(
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>>;

  /**
   * @deprecated
   */
  findAll(query?: ProjectFilters, pagination?: Pagination): Promise<PaginatedList<Project>>;
  /**
   * @deprecated
   */
  findExistingAppelsOffres(
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<AppelOffre.AppelOffreReadModel['id']>>;
  /**
   * @deprecated
   */
  findExistingPeriodesForAppelOffre(
    appelOffreId: AppelOffre.AppelOffreReadModel['id'],
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<AppelOffre.Periode['id']>>;
  /**
   * @deprecated
   */
  findExistingFamillesForAppelOffre(
    appelOffreId: AppelOffre.AppelOffreReadModel['id'],
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<AppelOffre.Famille['id']>>;
  /**
   * @deprecated
   */
  remove: (projectId: Project['id']) => ResultAsync<null>;
  /**
   * @deprecated
   */
  save: (project: Project) => ResultAsync<null>;
};
