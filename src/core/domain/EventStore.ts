import { ResultAsync } from '../utils'
import { DomainEvent } from './DomainEvent'
import { InfraNotAvailableError } from '@modules/shared'
import { EventBus } from './EventBus'
import { UniqueEntityID } from './UniqueEntityID'

export type EventStore = EventBus & {
  transaction: <E>(
    aggregateId: UniqueEntityID,
    fn: (aggregateEvents: DomainEvent[]) => ResultAsync<readonly DomainEvent[], E>
  ) => ResultAsync<null, InfraNotAvailableError | E>
}
