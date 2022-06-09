import { ResultAsync } from '@core/utils'
import { AppelOffre, Famille, Periode, User } from '@entities'
import { PaginatedList, Pagination } from '../../../types'
import { InfraNotAvailableError } from '../../shared'
import {
  ModificationRequestListItemDTO,
  ModificationRequestVariants,
  ModificationRequestStatusDTO,
} from '../dtos'

type GetModificationRequestListForAdminFilter = {
  user: User & { role: 'dreal' | 'dgec' | 'admin' }
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination?: Pagination
  recherche?: string
  modificationRequestStatus?: ModificationRequestStatusDTO
  modificationRequestType?: ModificationRequestVariants['type']
  forceNoAuthority?: true
}

export type GetModificationRequestListForAdmin = (
  filter: GetModificationRequestListForAdminFilter
) => ResultAsync<PaginatedList<ModificationRequestListItemDTO>, InfraNotAvailableError>
