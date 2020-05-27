import { User, Project, DREAL } from '../entities'
import { ResultAsync, OptionAsync } from '../types'

export type UserRepo = {
  findById: (id: User['id']) => OptionAsync<User>
  findAll: (query?: Record<string, any>) => Promise<Array<User>>
  insert: (user: User) => ResultAsync<User>
  update: (user: User) => ResultAsync<User>
  addProject: (
    userId: User['id'],
    projectId: Project['id']
  ) => ResultAsync<void>
  hasProject: (userId: User['id'], projectId: Project['id']) => Promise<boolean>
  remove: (userId: User['id']) => ResultAsync<void>
  findUsersForDreal: (dreal: DREAL) => Promise<Array<User>>
  findDrealsForUser: (userId: User['id']) => Promise<Array<DREAL>>
  addToDreal: (userId: User['id'], dreal: DREAL) => ResultAsync<void>
}
