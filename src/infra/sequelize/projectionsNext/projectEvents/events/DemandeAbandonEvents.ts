import { ProjectEvent } from '..'

export type DemandeAbandonEventStatus =
  | 'envoyée'
  | 'annulée'
  | 'rejetée'
  | 'en attente de confirmation'
  | 'demande confirmée'
  | 'accordée'

export type DemandeAbandonEvent = ProjectEvent & {
  type: 'DemandeAbandon'
  payload: {
    autorité: 'dgec' | 'dreal'
    statut: DemandeAbandonEventStatus
  }
}
