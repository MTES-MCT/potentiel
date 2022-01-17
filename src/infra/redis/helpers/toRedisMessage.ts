import { DomainEvent } from '@core/domain'

export const toRedisMessage = (event: DomainEvent) => ({
  type: event.type,
  payload: event.payload,
  occurredAt: event.occurredAt.getTime(),
})
