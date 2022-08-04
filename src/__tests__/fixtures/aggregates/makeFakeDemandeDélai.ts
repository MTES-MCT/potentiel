import { UniqueEntityID } from '@core/domain'
import { DemandeDélai, StatutDemandeDélai } from '@modules/demandeModification'

export const makeFakeDemandeDélai = (overide?: {
  id?: string
  statut?: StatutDemandeDélai
  projetId?: string
  ancienneDateThéoriqueAchèvement?: string
  dateAchèvementAccordée?: string
  délaiEnMoisAccordé?: number
}): DemandeDélai => ({
  pendingEvents: [],
  id: new UniqueEntityID(overide?.id) || new UniqueEntityID(),
  statut: overide?.statut || 'envoyée',
  projetId: overide?.projetId,
  ancienneDateThéoriqueAchèvement: overide?.ancienneDateThéoriqueAchèvement,
  dateAchèvementAccordée: overide?.dateAchèvementAccordée,
  délaiEnMoisAccordé: overide?.délaiEnMoisAccordé,
})
