import { PasswordRetrieval, Credentials } from '../entities'
import { ResultAsync, OptionAsync } from '../types'

export type PasswordRetrievalRepo = {
  findById: (id: PasswordRetrieval['id']) => OptionAsync<PasswordRetrieval>
  insert: (item: PasswordRetrieval) => ResultAsync<PasswordRetrieval>
  remove: (id: PasswordRetrieval['id']) => ResultAsync<null>
}
