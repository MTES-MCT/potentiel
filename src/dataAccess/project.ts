import { Project } from '../entities'

export type ProjectRepo = {
  findAll: () => Promise<Array<Project>>
  insertMany: (projects: Array<Project>) => Promise<void>
}
