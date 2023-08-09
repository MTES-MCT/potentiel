import { Project, User } from '../entities';
import { Région } from '../modules/dreal/région';
import { AppelOffre, Famille, Periode } from '@potentiel/domain-views';
import { ResultAsync } from '../types';
import { PaginatedList, Pagination } from '../modules/pagination';

export interface ProjectFilters {
  isNotified?: boolean;
  garantiesFinancieres?: 'submitted' | 'notSubmitted' | 'pastDue';
  isClasse?: boolean;
  isClaimed?: boolean;
  isAbandoned?: boolean;
  nomProjet?: string;
  appelOffreId?: AppelOffre['id'] | AppelOffre['id'][];
  periodeId?: Periode['id'] | Periode['id'][];
  familleId?: Famille['id'] | Famille['id'][];
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
  searchAllMissingOwner(
    email: string,
    id: string,
    terms?: string,
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
  ): Promise<Array<AppelOffre['id']>>;
  /**
   * @deprecated
   */
  findExistingPeriodesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<Periode['id']>>;
  /**
   * @deprecated
   */
  findExistingFamillesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<Famille['id']>>;
  /**
   * @deprecated
   */
  remove: (projectId: Project['id']) => ResultAsync<null>;
  /**
   * @deprecated
   */
  save: (project: Project) => ResultAsync<null>;
};
