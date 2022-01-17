import { ResultAsync } from '@core/utils'
import { PaginatedList, Pagination } from '../../../types'
import { InfraNotAvailableError } from '../../shared'
import { FailedNotificationDTO } from '../dtos'

export type GetFailedNotificationDetails = (
  pagination: Pagination
) => ResultAsync<PaginatedList<FailedNotificationDTO>, InfraNotAvailableError>
