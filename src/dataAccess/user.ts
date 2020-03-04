import { User } from '../entities'

export type UserRepo = {
  findById: ({ id: string }) => Promise<User | null>
  insert: (user: User) => Promise<string>
}
