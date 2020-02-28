import { Credentials } from '../entities'

export type CredentialsRepo = {
  findByEmail: ({ email: string }) => Promise<Credentials>
  insert: (credentials: Credentials) => Promise<void>
}
