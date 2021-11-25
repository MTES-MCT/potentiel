import { DomainEvent } from '../../../core/domain/DomainEvent'
export const toRedisTuple = (event: DomainEvent): RedisTuple => ({
  type: event.type,
  payload: JSON.stringify(event.payload),
  occurredAt: event.occurredAt.getTime().toString(),
})
