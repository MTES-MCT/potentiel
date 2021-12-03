import { DomainEvent } from '../../../core/domain/DomainEvent'

export const toRedisMessage = (event: DomainEvent) => ({
  type: event.type,
  payload: event.payload,
  occurredAt: event.occurredAt.getTime(),
})
