import { DomainEvent, UniqueEntityID } from '@core/domain'
import { StatutDemandeDélai } from '@modules/demandeModification'

export const makeFakeDemandeDélai = (id?: string, statut?: StatutDemandeDélai) => ({
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(id) || new UniqueEntityID(),
  statut: statut || 'envoyée',
  projet: undefined,
})
