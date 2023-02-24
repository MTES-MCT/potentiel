import { Project, User, AppelOffre, Famille, Periode } from '@entities';
import { Région } from '@modules/dreal/région';
import { ResultAsync, Pagination, PaginatedList } from '../types';

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

export type ProjectRepo = {
  findById: (id: Project['id']) => Promise<Project | undefined>;
  findOne(query: Record<string, any>): Promise<Project | undefined>;

  searchForRegions(
    regions: Région | Région[],
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>>;
  findAllForRegions(
    regions: Région | Région[],
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>>;

  searchAll(
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>>;

  searchAllMissingOwner(
    email: string,
    id: string,
    terms?: string,
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>>;

  findAll(query?: ProjectFilters, pagination?: Pagination): Promise<PaginatedList<Project>>;

  findExistingAppelsOffres(
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<AppelOffre['id']>>;

  findExistingPeriodesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<Periode['id']>>;

  findExistingFamillesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<Famille['id']>>;

  countUnnotifiedProjects(
    appelOffreId: AppelOffre['id'],
    periodeId: Periode['id'],
  ): Promise<number>;

  remove: (projectId: Project['id']) => ResultAsync<null>;
  save: (project: Project) => ResultAsync<null>;
  getUsers: (projectId: Project['id']) => Promise<Array<User>>;
};
