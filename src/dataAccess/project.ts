import {
  Project,
  CandidateNotification,
  ProjectAdmissionKey
} from '../entities'

export type ProjectRepo = {
  findById: ({ id: string }) => Promise<Project | null>
  findAll: (
    query?: Record<string, any>,
    includeNotifications?: boolean
  ) => Promise<Array<Project>>
  insertMany: (projects: Array<Project>) => Promise<void>
  update: (project: Project) => Promise<void>
  addNotification: (
    project: Project,
    notification: CandidateNotification
  ) => Promise<void>
  addProjectAdmissionKey: (
    project: Project,
    key: ProjectAdmissionKey
  ) => Promise<void>
}
