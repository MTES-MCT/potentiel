import { Credentials } from '../entities'
import { ResultAsync, OptionAsync } from '../types'

export type CredentialsRepo = {
  findByEmail: (email: Credentials['email']) => OptionAsync<Credentials>
  insert: (credentials: Credentials) => ResultAsync<Credentials>
  update: (credentials: Credentials) => ResultAsync<Credentials>
}
