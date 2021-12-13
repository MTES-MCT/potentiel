import { DomainEvent } from '../../../core/domain'

export const fromPersistance = (eventRaw: any): DomainEvent | null => {
  const { id, type, payload, context, occurredAt, aggregateId } = eventRaw

  return {
    id,
    type,
    payload,
    context,
    occurredAt: new Date(occurredAt),
    aggregateId,
  }
}
