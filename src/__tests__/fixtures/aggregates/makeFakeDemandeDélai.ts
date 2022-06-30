import { DomainEvent, UniqueEntityID } from '@core/domain'
import { DemandeDélai, StatutDemandeDélai } from '@modules/demandeModification'

export const makeFakeDemandeDélai = (overide?: {
  id?: string
  statut?: StatutDemandeDélai
  projectId?: string
}): DemandeDélai => ({
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(overide?.id) || new UniqueEntityID(),
  statut: overide?.statut || 'envoyée',
  projetId: overide?.projectId,
})
