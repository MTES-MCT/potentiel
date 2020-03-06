import { Project } from '../entities'

export type ProjectRepo = {
  findById: ({ id: string }) => Promise<Project | null>
  findAll: (query?: Record<string, any>) => Promise<Array<Project>>
  insertMany: (projects: Array<Project>) => Promise<void>
  update: (project: Project) => Promise<void>
}
