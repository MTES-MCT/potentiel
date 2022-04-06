import { ResultAsync } from '@core/utils'
import { AppelOffre, Famille, Periode, User } from '@entities'
import { PaginatedList, Pagination } from '../../../types'
import { InfraNotAvailableError } from '../../shared'
import {
  ModificationRequestListItemDTO,
  ModificationRequestVariants,
  ModificationRequestStatusDTO,
} from '../dtos'

type GetModificationRequestListForUserFilter = {
  user: User
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination?: Pagination
  recherche?: string
  modificationRequestStatus?: ModificationRequestStatusDTO
  modificationRequestType?: ModificationRequestVariants['type']
  forceNoAuthority?: true
}

export type GetModificationRequestListForUser = (
  filter: GetModificationRequestListForUserFilter
) => ResultAsync<PaginatedList<ModificationRequestListItemDTO>, InfraNotAvailableError>
