import { ProjectEvent } from '..'

export type DemandeAnnulationAbandonEventStatus =
  | 'envoyée'
  | 'annulée'
  | 'rejetée'
  | 'en attente de confirmation'
  | 'demande confirmée'
  | 'accordée'

export type DemandeAnnulationAbandonEvent = ProjectEvent & {
  type: 'DemandeAnnulationAbandon'
  payload: {
    autorité: 'dgec'
    statut: DemandeAnnulationAbandonEventStatus
  }
}
