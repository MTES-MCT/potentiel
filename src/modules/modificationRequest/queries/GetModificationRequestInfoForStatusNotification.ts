import { ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { ModificationRequestInfoForStatusNotificationDTO } from '../dtos/ModificationRequestInfoForStatusNotificationDTO'

export interface GetModificationRequestInfoForStatusNotification {
  (modificationRequestId: string): ResultAsync<
    ModificationRequestInfoForStatusNotificationDTO,
    EntityNotFoundError | InfraNotAvailableError
  >
}
