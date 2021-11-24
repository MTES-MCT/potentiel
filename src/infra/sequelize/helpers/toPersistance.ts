import { DomainEvent, UniqueEntityID } from '../../../core/domain'

export const toPersistance = (event: DomainEvent) => ({
  id: new UniqueEntityID().toString(),
  type: event.type,
  version: event.getVersion(),
  payload: event.payload,
  aggregateId:
    event.aggregateId &&
    (Array.isArray(event.aggregateId) ? event.aggregateId : [event.aggregateId]),
  requestId: event.requestId,
  occurredAt: event.occurredAt,
})
