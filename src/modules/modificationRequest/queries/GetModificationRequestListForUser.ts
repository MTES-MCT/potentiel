import { ResultAsync } from '../../../core/utils'
import { AppelOffre, Famille, Periode, User } from '../../../entities'
import { PaginatedList, Pagination } from '../../../types'
import { InfraNotAvailableError } from '../../shared'
import {
  ModificationRequestListItemDTO,
  ModificationRequestVariants,
  ModificationRequestStatus,
} from '../dtos'

interface GetModificationRequestListForUserDeps {
  user: User
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination?: Pagination
  recherche?: string
  modificationRequestStatus?: ModificationRequestStatus
  modificationRequestType?: ModificationRequestVariants
}

export interface GetModificationRequestListForUser {
  (deps: GetModificationRequestListForUserDeps): ResultAsync<
    PaginatedList<ModificationRequestListItemDTO>,
    InfraNotAvailableError
  >
}
