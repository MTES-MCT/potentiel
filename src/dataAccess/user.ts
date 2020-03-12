import { User, Project } from '../entities'

export type UserRepo = {
  findById: (id: User['id']) => Promise<User | null>
  insert: (user: User) => Promise<string>
  findProjects: (userId: User['id']) => Promise<Array<Project>>
  addProject: (userId: User['id'], projectId: Project['id']) => Promise<void>
  remove: (userId: User['id']) => Promise<void>
}
