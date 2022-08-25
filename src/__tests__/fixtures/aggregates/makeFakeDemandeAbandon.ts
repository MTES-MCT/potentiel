import { UniqueEntityID } from '@core/domain'
import {
  DemandeAbandon,
  StatutDemandeAbandon,
} from '../../../modules/demandeModification/demandeAbandon/DemandeAbandon'

export const makeFakeDemandeAbandon = (override?: {
  id?: string
  statut?: StatutDemandeAbandon
  projetId?: string
}): DemandeAbandon => ({
  pendingEvents: [],
  id: new UniqueEntityID(override?.id) || new UniqueEntityID(),
  statut: override?.statut || 'envoyée',
  projetId: override?.projetId ?? 'projet-id',
})
