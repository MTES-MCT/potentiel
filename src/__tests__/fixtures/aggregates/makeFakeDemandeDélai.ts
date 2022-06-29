import { DomainEvent, UniqueEntityID } from '@core/domain'
import { StatutDemandeDélai } from '@modules/demandeModification'

export const makeFakeDemandeDélai = (overide?: {
  id?: string
  statut?: StatutDemandeDélai
  projectId?: string
}) => ({
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(overide?.id) || new UniqueEntityID(),
  statut: overide?.statut || 'envoyée',
  projet: overide?.projectId ? { id: new UniqueEntityID(overide.projectId) } : undefined,
})
