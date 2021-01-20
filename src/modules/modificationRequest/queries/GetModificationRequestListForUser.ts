import { ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { PaginatedList, Pagination } from '../../../types'
import { InfraNotAvailableError } from '../../shared'
import { ModificationRequestListItemDTO } from '../dtos'

export interface GetModificationRequestListForUser {
  (user: User, pagination: Pagination): ResultAsync<
    PaginatedList<ModificationRequestListItemDTO>,
    InfraNotAvailableError
  >
}
