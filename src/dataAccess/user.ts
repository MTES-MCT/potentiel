import { User } from '../entities'

export type UserRepo = {
  findById: ({ id: string }) => Promise<User>
  insert: (user: User) => Promise<void>
}
