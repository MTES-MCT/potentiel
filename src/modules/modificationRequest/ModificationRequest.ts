import { UniqueEntityID } from '../../core/domain'
import { Result } from '../../core/utils'
import { EventStoreAggregate } from '../eventStore'

export interface ModificationRequest extends EventStoreAggregate {
  acceptRecours(): Result<null, never>
  readonly projectId: UniqueEntityID
}
