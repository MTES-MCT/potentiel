import { Project, User, AppelOffre, Famille, Periode, DREAL } from '../entities'
import { OptionAsync, ResultAsync, Pagination, PaginatedList } from '../types'
import { Context } from 'mocha'

export interface ProjectFilters {
  isNotified?: boolean
  hasGarantiesFinancieres?: boolean
  isClasse?: boolean
  nomProjet?: string
  appelOffreId?: AppelOffre['id'] | AppelOffre['id'][]
  periodeId?: Periode['id'] | Periode['id'][]
  familleId?: Famille['id'] | Famille['id'][]
  email?: Project['email'] | Project['email'][]
}

export type ContextSpecificProjectListFilter =
  | {
      isNotified: boolean
    }
  | {
      userId: User['id']
    }
  | {
      regions: DREAL | DREAL[]
    }

export type ProjectRepo = {
  findById: (
    id: Project['id'],
    includeHistory?: boolean
  ) => OptionAsync<Project>
  findOne(query: Record<string, any>): Promise<Project | undefined>

  searchForUser(
    userId: User['id'],
    terms: string,
    pagination: Pagination,
    filters?: ProjectFilters
  ): Promise<PaginatedList<Project>>
  findAllForUser(
    userId: User['id'],
    pagination: Pagination,
    filters?: ProjectFilters
  ): Promise<PaginatedList<Project>>

  searchForRegions(
    regions: DREAL | DREAL[],
    terms: string,
    pagination: Pagination,
    filters?: ProjectFilters
  ): Promise<PaginatedList<Project>>
  findAllForRegions(
    regions: DREAL | DREAL[],
    pagination: Pagination,
    filters?: ProjectFilters
  ): Promise<PaginatedList<Project>>

  searchAll(
    terms: string,
    pagination: Pagination,
    filters?: ProjectFilters
  ): Promise<PaginatedList<Project>>

  findAll(query?: ProjectFilters): Promise<Array<Project>>
  findAll(
    query: ProjectFilters,
    pagination: Pagination
  ): Promise<PaginatedList<Project>>

  findExistingAppelsOffres(
    options?: ContextSpecificProjectListFilter
  ): Promise<Array<AppelOffre['id']>>

  findExistingPeriodesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter
  ): Promise<Array<Periode['id']>>

  findExistingFamillesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter
  ): Promise<Array<Famille['id']>>

  remove: (projectId: Project['id']) => ResultAsync<void>
  save: (project: Project) => ResultAsync<Project>
  getUsers: (projectId: Project['id']) => Promise<Array<User>>
}
