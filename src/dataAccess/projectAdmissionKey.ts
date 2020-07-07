import { ProjectAdmissionKey } from '../entities'
import { ResultAsync, OptionAsync, PaginatedList, Pagination } from '../types'

export type ProjectAdmissionKeyRepo = {
  findById: (id: ProjectAdmissionKey['id']) => OptionAsync<ProjectAdmissionKey>

  findAll(query?: Record<string, any>): Promise<Array<ProjectAdmissionKey>>

  getList(
    query: Record<string, any>,
    pagination: Pagination
  ): Promise<PaginatedList<ProjectAdmissionKey>>

  save: (
    projectAdmissionKey: ProjectAdmissionKey
  ) => ResultAsync<ProjectAdmissionKey>
}
