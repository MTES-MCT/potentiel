import { DomainEvent, UniqueEntityID } from '@core/domain'

export const makeFakeDemandeDélai = () => ({
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(),
  statut: 'envoyée',
})
