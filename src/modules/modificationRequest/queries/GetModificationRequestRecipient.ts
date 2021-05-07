import { ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export interface GetModificationRequestRecipient {
  (modificationRequestId: string): ResultAsync<
    'dgec' | 'dreal',
    EntityNotFoundError | InfraNotAvailableError
  >
}
