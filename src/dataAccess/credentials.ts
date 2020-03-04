import { Credentials } from '../entities'

export type CredentialsRepo = {
  findByEmail: ({ email: string }) => Promise<Credentials | null>
  insert: (credentials: Credentials) => Promise<void>
}
