import { UniqueEntityID } from '@core/domain'
import {
  StatutDemandeAnnulationAbandon,
  DemandeAnnulationAbandon,
} from '@modules/demandeModification'

export const makeFakeDemandeAnnulationAbandon = (override?: {
  id?: string
  statut?: StatutDemandeAnnulationAbandon
  projetId?: string
}): DemandeAnnulationAbandon => ({
  pendingEvents: [],
  id: new UniqueEntityID(override?.id) || new UniqueEntityID(),
  statut: override?.statut || 'envoyée',
  projetId: override?.projetId ?? 'projet-id',
})
