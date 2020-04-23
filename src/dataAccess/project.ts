import { CandidateNotification, Project, User } from '../entities'
import { OptionAsync, ResultAsync, Pagination, PaginatedList } from '../types'

export type ProjectRepo = {
  findById: (id: Project['id']) => OptionAsync<Project>
  findAll(query?: Record<string, any>): Promise<Array<Project>>
  findAll(
    query: Record<string, any>,
    pagination: Pagination
  ): Promise<PaginatedList<Project>>
  findByUser: (
    userId: User['id'],
    excludeUnnotified?: boolean
  ) => Promise<Array<Project>>
  insert: (project: Project) => ResultAsync<Project>
  update: (
    projectId: Project['id'],
    update: Partial<Project>
  ) => ResultAsync<Project>
  remove: (projectId: Project['id']) => ResultAsync<void>
  addNotification: (
    project: Project,
    notification: CandidateNotification
  ) => ResultAsync<Project>
}
