import { CandidateNotification, Project, User } from '../entities'
import { OptionAsync, ResultAsync } from '../types'

export type ProjectRepo = {
  findById: (id: Project['id']) => OptionAsync<Project>
  findAll: (
    query?: Record<string, any>,
    includeNotifications?: boolean
  ) => Promise<Array<Project>>
  findByUser: (userId: User['id']) => Promise<Array<Project>>
  insert: (project: Project) => ResultAsync<Project>
  update: (project: Project) => ResultAsync<Project>
  remove: (projectId: Project['id']) => ResultAsync<void>
  addNotification: (
    project: Project,
    notification: CandidateNotification
  ) => ResultAsync<Project>
}
