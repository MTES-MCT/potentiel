import { ModificationRequest } from '@entities'
import { ResultAsync, OptionAsync } from '../types'

export type ModificationRequestRepo = {
  findById: (id: ModificationRequest['id']) => OptionAsync<ModificationRequest>
  findAll: (
    query?: Record<string, any>,
    includeInfo?: boolean
  ) => Promise<Array<ModificationRequest>>
  insert: (ModificationRequest: ModificationRequest) => ResultAsync<ModificationRequest>
  update: (ModificationRequest: ModificationRequest) => ResultAsync<ModificationRequest>
}
