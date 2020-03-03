import { Credentials } from '../entities'

export type CredentialsRepo = {
  findByEmail: ({ email: string }) => Promise<Credentials> | Promise<null>
  insert: (credentials: Credentials) => Promise<void>
}
